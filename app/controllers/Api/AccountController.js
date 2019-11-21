const {ObjectId} = require('mongodb'); // or ObjectID
const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');
const qs = require('qs');

const UserModel = require("../../models/UserModel").User;

const User = require("../../Ais/Repository/User");
const ApprovedCustomer = require("../../Ais/Repository/ApprovedCustomer");
const JsonResponse = require("../../TheBadusLibs/JsonResponse");
const PasswordGenerate = require("../../TheBadusLibs/ThePasswordGenerate");
const UserFinder = require("../../Ais/Repository/Finder/UserFinder");
const StatusFinder = require("../../Ais/Repository/Finder/StatusFinder");

module.exports.AccountController = {
    index_user: async (req,res) => 
    {
        let finder = new UserFinder(req.query);
        let jsonResponse = new JsonResponse();
        try {
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
            
            var paginator = await finder.get();
            
            jsonResponse.setData(paginator.data);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(paginator));

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    index_status: async (req,res) => 
    {
        
        let finder = new StatusFinder(req.query);
        let jsonResponse = new JsonResponse();
        try {
            if(req.query.per_page)
                finder.setPerPage(req.query.per_page);

            if(req.query.page)
                finder.setPage(req.query.page);

            if(req.query.keyword)
                finder.setKeyword(req.query.keyword);

            if(req.query.status)
                finder.setStatusId(req.query.status);
            
            if(req.query.order_by) {
                finder.orderBy(req.query.order_by['column'], req.query.order_by['ordered']);
            } else {    
                finder.orderBy('created_at', 'desc');
            }

            let getInfoUser = await UserModel.findOne({_id: req.user.user_id}).exec();

            let where = {};

            if(getInfoUser.role_type != 2) {
                var descendants=[];
                var stack=[];

                stack.push(getInfoUser);
                while (stack.length > 0){
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
                list.push({
                    _id: x._id,
                    full_name: x.full_name,
                    approved: x.approved,
                    is_db: x.approved
                })
            })
            
            jsonResponse.setData(list);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(paginator));

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    approval_to_approved: async (req,res) => 
    {
        
        let finder = new StatusFinder();
        let finderTotal = new StatusFinder();
        let jsonResponse = new JsonResponse();
        try {
            finder.setPage('all');

            finder.setStatusId(false);

            let getInfoUser = await UserModel.findOne({_id: req.user.user_id}).exec();

            let where = {};

            if(getInfoUser.role_type != 2) {
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

            finderTotal.setPage('all');
            
            var paginatorAllStatus = await finderTotal.get(where);

            let total = {
                total: paginatorAllStatus.data.length,
                total_pending: paginator.data.length
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
    delete_user: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();
        
        try {
            let id = req.params.id;

            let repoUser = new User();

            let result = await repoUser.delete(id);

            jsonResponse.setMessage(result['message']);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());

        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    store_user: async (req,res) => 
    {
        const dateFormatter = new DateFormatter();
        const now = dateFormatter.date(date);
        let jsonResponse = new JsonResponse();
        try {
            let model = new UserModel();
            
            model._id = req.body.id;
            model.username = req.body.username;
            model.full_name = req.body.full_name;
            model.gender = req.body.gender;
            model.email = req.body.email;
            model.address = req.body.address;
            model.role_type = req.body.role_type,
            model.user_id_parent = req.body.user_id_parent;
            model.password = req.body.password == req.body.current_password ? req.body.current_password : PasswordGenerate(req.body.password);
            model.is_actived = true;
            model.approved = true;
            model.created_at = !req.body.id ? now : undefined;
            model.created_by = !req.body.id ? ObjectId(req.user.user_id) : undefined;
            model.updated_at = req.body.id ? now : undefined;
            model.updated_by = req.body.id ? ObjectId(req.user.user_id) : undefined;
            
            let repoUser = new User(model);
            let result = await repoUser.saveUser();
            
            jsonResponse.setMessage(`${result['data'].full_name}  telah berhasil tersimpan.`);
            jsonResponse.setData(result['data']._id);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());

        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    approved: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();
        try {
            
            req.body = qs.parse(req.body);
            let detail = Object.values(req.body.detail);

            let repo = new ApprovedCustomer(req);

            if(detail) {
                detail.forEach(async x => {
                    switch(x['approved']) {
                        case 'true':
                            repo.check(x['_id']);
                         case 'false':
                            repo.uncheck(x['_id']);
                    }
                })
            }    

            let result = await repo.save();

            jsonResponse.setMessage(result['message']);

            setTimeout(() => {
                if(result['status']) {
                    if(!res.headersSent)
                    res.status(200).send(jsonResponse.getResponse());
                } else {
                    jsonResponse.setError(true);
                    if(!res.headersSent)
                    res.status(200).send(jsonResponse.getResponse());
                }
                
            }, (detail.length) * 70)

        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    detail_user: async (req,res) => 
    {
        try {
            let id = req.params.id;
            
            let repoUser = new User();

            let result = await repoUser.show(id);
            
            let jsonResponse = new JsonResponse();
            jsonResponse.setData(result);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(result));

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())

        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    }
}