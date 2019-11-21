const {ObjectId} = require('mongodb'); // or ObjectID
this.getBalance = require('./');
const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');
const qs = require('qs');

const UserModel = require("../../models/UserModel").User;
const RoleType = require("../../Ais/Repository/RoleType");
const JsonResponse = require("../../TheBadusLibs/JsonResponse");
const Customer = require("../../Ais/Repository/Customer");
const CustomerFinder = require("../../Ais/Repository/Finder/CustomerFinder");

module.exports.CustomerController = {
    index: async (req,res) => 
    {
        let finder = new CustomerFinder(req.query);
        let jsonResponse = new JsonResponse();
        let repoRoleType = new RoleType();
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

            let getInfoUser = await UserModel.findOne({_id: req.user.user_id}).exec();

            let where = {};

            if(roleTypeName != 'admin') {
                var descendants=[];
                var stack=[];

                stack.push(getInfoUser);
                while (stack.length>0){
                    var currentnode = await stack.pop();
                    var children = UserModel.collection.find({user_id_parent: currentnode._id});
                    while(true === await children.hasNext()) {
                        var child = await children.next();
                        
                        descendants.push(child._id)
                        stack.push(child);
                    }
                }
                
                where = {
                    _id: {$in: descendants}
                }
            }
            
            var paginator = await finder.get(where);

            let list = [];
            paginator.data.forEach(x => {
                if(roleTypeName == 'admin') {
                    list.push({
                        _id: x._id,
                        full_name: x.full_name,
                        email: x.email,
                        address: x.address,
                        phone: x.phone,
                        username: x.username
                    });
                } else {
                    list.push({
                        _id: x._id,
                        full_name: x.full_name,
                        email: x.email,
                        address: x.address,
                        phone: x.phone
                    });
                }
            })
            
            jsonResponse.setData(list);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(paginator));

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            jsonResponse.setMessage(e.message);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    downline_count: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();
        try {

            let getInfoUser = await UserModel.findOne({_id: req.user.user_id}).exec();

            var descendants=[];
            if(getInfoUser.role_type != 2) {
                var stack=[];

                stack.push(getInfoUser);
                while (stack.length>0){
                    var currentnode = await stack.pop();
                    var children = UserModel.collection.find({user_id_parent: currentnode._id});
                    while(true === await children.hasNext()) {
                        var child = await children.next();
                        
                        descendants.push(child._id)
                        stack.push(child);
                    }
                }
            } else {
                descendants = await UserModel.find({}).exec();
            }

            let total = {
                total: descendants.length
            }
            
            jsonResponse.setData(total);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            jsonResponse.setMessage(e.message);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    balance: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();
        let repoCustomer = new Customer();
        try {
            let balance = await repoCustomer.getBalanceById(req.user.user_id)
            
            jsonResponse.setData(balance);
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
}