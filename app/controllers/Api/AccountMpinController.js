const {ObjectId} = require('mongodb'); // or ObjectID
const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');
const qs = require('qs');

const UserModel = require("../../models/UserModel").User;
const MpinModel = require("../../models/MpinModel").Mpin;
const { genMpin } = require("../../TheBadusLibs/GenerateMpin");
const RoleType = require("../../Ais/Repository/RoleType");
const JsonResponse = require("../../TheBadusLibs/JsonResponse");
const MpinFinder = require("../../Ais/Repository/Finder/MpinFinder");

module.exports.AccountMpinController = {
    index: async (req,res) => 
    {
        let finder = new MpinFinder(req.query);
        let repoRoleType = new RoleType();
        let jsonResponse = new JsonResponse();
        const dateFormatter = new DateFormatter();
        try {
            let roleTypeName = await repoRoleType.getRoleTypeNameByCode(req.user_info.role_type);
            
            if(req.query.per_page)
                finder.setPerPage(req.query.per_page);

            if(req.query.page)
                finder.setPage(req.query.page);
            
            if(req.query.keyword)
                finder.setKeyword(req.query.keyword);
            
            if(req.query.order_by) {
                finder.orderBy(req.query.order_by['column'], req.query.order_by['ordered']);
            } else {    
                finder.orderBy('created_at', 'desc');
            }

            let where = {};
            
            if(roleTypeName != 'admin') {
                where = {user_id: req.user.user_id};
            }
            
            var paginator = await finder.get(where);
            
            let list = [];
            paginator.data.forEach(x => {
                
                let q = {
                    is_used: x.is_used,
                    is_actived: x.is_actived,
                    used_at: x.used_at,
                    used_by: x.used_by,
                    _id: x._id,
                    user_id: x.user_id,
                    user_full_name: x.user ? x.user.full_name : '',
                    mpin: x.mpin,
                    created_at: dateFormatter.format(date, x.created_at),
                    created_by: x.created_by,
                }
                list.push(q)
            })
            
            jsonResponse.setData(list);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(paginator));

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            console.log(e)
            jsonResponse.setMessage(e.message);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    generate: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();

        try{

            const dateFormatter = new DateFormatter();
            let rowGetCustomer = await UserModel.findOne({_id: req.body.customer_id}).exec();
            for(let i=0; i < parseInt(req.body.count); i++) {
                await MpinModel.collection.insertOne({user_id: ObjectId(req.body.customer_id), mpin: genMpin(rowGetCustomer.full_name), created_at: dateFormatter.date(date), created_by: req.user.user_id, is_used: false, is_actived: true, used_at: '', used_by: null})
            }

            jsonResponse.setMessage('Anda berhasil membuat pin');

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())

        } catch(e) {
            console.log(e)
            jsonResponse.setMessage(e.message);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    count: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();
        try {
            let getInfoUser = await UserModel.findOne({_id: req.user.user_id}).exec();

            let totalData = 0;
            let totalPendingData = 0;

            if(getInfoUser.role_type != 2) {
                totalPendingData = await MpinModel.countDocuments({user_id: req.user.user_id, is_actived: true, is_used: false}).exec();
                totalData = await MpinModel.countDocuments({user_id: req.user.user_id}).exec();
            } else {
                totalPendingData = await MpinModel.countDocuments({is_actived: true, is_used: false}).exec();
                totalData = await MpinModel.countDocuments({}).exec();
            }
            
            let total = {
                total: totalData,
                total_pending: totalPendingData
            }

            jsonResponse.setData(total);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    count_per_month: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();
        try {
            let month = req.query.month;
            let getInfoUser = await UserModel.findOne({_id: req.user.user_id}).exec();

            let totalData = [];

            if(getInfoUser.role_type != 2) {
                for(let i = 0;i < month.length;i++){
                    let countData = await MpinModel.countDocuments({user_id: req.user.user_id, is_actived: true, is_used: false, created_at: {'$gte' : month[i].start_date, '$lte': month[i].end_date}}).exec();
                    
                    totalData.push(countData);
                }

            } else {
                for(let i = 0;i < month.length;i++){
                    let countData = await MpinModel.countDocuments({is_actived: true, is_used: false, created_at: {'$gte' : month[i].start_date, '$lte': month[i].end_date}}).exec();
                    
                    totalData.push(countData);
                }
            }
            
            let total = {
                total: totalData
            }

            jsonResponse.setData(total);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    count_utilization_per_month: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();
        try {
            let month = req.query.month;
            let getInfoUser = await UserModel.findOne({_id: req.user.user_id}).exec();

            let totalData = [];

            if(getInfoUser.role_type != 2 && month) {
                for(let i = 0;i < month.length;i++){
                    let countData = await MpinModel.countDocuments({user_id: req.user.user_id, is_actived: false, is_used: true, used_at: {$ne: '', '$gte' : month[i].start_date, '$lte': month[i].end_date}}).exec();
                    
                    totalData.push(countData);
                }
            } else if(month) {
                for(let i = 0;i < month.length;i++){
                    let countData = await MpinModel.countDocuments({is_actived: false, is_used: true, used_at: {$ne: '', '$gte' : month[i].start_date, '$lte': month[i].end_date}}).exec();
                    
                    totalData.push(countData);
                }
            }
            
            let total = {
                total: totalData
            }

            jsonResponse.setData(total);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            console.log(e)
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    }
}