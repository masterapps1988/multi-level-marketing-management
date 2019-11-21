const {ObjectId} = require('mongodb'); // or ObjectID
const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');
const qs = require('qs');

const PositionModel = require("../../models/PositionModel").Position;
const CategoryModel = require("../../models/CategoryModel").Category;
const RoleTypeModel = require("../../models/RoleTypeModel").RoleType;
const RolePermissionModel = require("../../models/RolePermissionModel").RolePermission;

const Position = require("../../Ais/Repository/Position");
const Permission = require("../../Ais/Repository/Permission");
const RoleType = require("../../Ais/Repository/RoleType");
const Category = require("../../Ais/Repository/Category");
const RolePermission = require("../../Ais/Repository/RolePermission");
const JsonResponse = require("../../TheBadusLibs/JsonResponse");
const PositionFinder = require("../../Ais/Repository/Finder/PositionFinder");
const PermissionFinder = require("../../Ais/Repository/Finder/PermissionFinder");
const RoleTypeFinder = require("../../Ais/Repository/Finder/RoleTypeFinder");

const getModelPosition = async (id) => {
    let row = await PositionModel.findOne({_id: id}).exec();
    if(!row){
        throw new Error('Level tidak ditemukan');
    }

    return row;
}

const getModelPermission = async (id) => {
    let row = await CategoryModel.findOne({_id: id, group_by: 'permission'}).exec();
    if(!row){
        throw new Error('Permission tidak ditemukan');
    }

    return row;
}

const getModelRoleType = async (id) => {
    let row = await RoleTypeModel.findOne({_id: id}).exec();
    if(!row){
        throw new Error('Jabatan tidak ditemukan');
    }

    return row;
}

module.exports.SettingController = {
    index_level: async (req,res) => 
    {
        let finder = new PositionFinder(req.query);
        const jsonResponse = new JsonResponse();
        try {
            if(req.query.per_page)
                finder.setPerPage(req.query.per_page);

            if(req.query.page)
                finder.setPage(req.query.page);
            
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
    index_permission: async (req,res) => 
    {
        let finder = new PermissionFinder(req.query);
        const jsonResponse = new JsonResponse();
        try {
            if(req.query.per_page)
                finder.setPerPage(req.query.per_page);

            if(req.query.page)
                finder.setPage(req.query.page);
            
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
    index_role_type: async (req,res) => 
    {
        let finder = new RoleTypeFinder(req.query);
        const jsonResponse = new JsonResponse();
        try {
            if(req.query.per_page)
                finder.setPerPage(req.query.per_page);

            if(req.query.page)
                finder.setPage(req.query.page);
            
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
    show_level: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();
        try {
            let id = req.params.id;
            
            let result = await getModelPosition(id);
            
            jsonResponse.setData(result);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    show_permission: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();
        try {
            let id = req.params.id;
            
            let result = await getModelPermission(id);
            
            jsonResponse.setData(result);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    show_role_type: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();
        try {
            let id = req.params.id;
            
            let result = await getModelRoleType(id);
            
            jsonResponse.setData(result);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    store_level: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();
        const dateFormatter = new DateFormatter();
        const now = dateFormatter.date(date);

        try {
            let model = new PositionModel();
            
            model._id = req.body.id;
            model.code = req.body.code;
            model.name = req.body.name;
            model.level = req.body.level;
            model.created_at = !req.body.id ? now : undefined;
            model.created_by = !req.body.id ? ObjectId(req.user.user_id) : undefined;
            model.updated_at = req.body.id ? now : undefined;
            model.updated_by = req.body.id ? ObjectId(req.user.user_id) : undefined;
            
            let repoPosition = new Position(model);
            let result = await repoPosition.save();
            
            jsonResponse.setMessage(`${result['data'].name}  telah berhasil tersimpan.`);
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
    store_permission: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();
        const dateFormatter = new DateFormatter();
        const now = dateFormatter.date(date);

        try {
            let model = new CategoryModel();
            
            model._id = req.body.id;
            model.label = req.body.label;
            model.name = req.body.name;
            model.notes = req.body.notes;
            model.group_by = 'permission';
            model.created_at = !req.body.id ? now : undefined;
            model.updated_at = req.body.id ? now : undefined;
            
            let repoPermission = new Permission(model);
            let result = await repoPermission.save();
            
            jsonResponse.setMessage(`${result['data'].name}  telah berhasil tersimpan.`);
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
    store_role_type: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();
        const dateFormatter = new DateFormatter();
        const now = dateFormatter.date(date);

        try {
            let model = new RoleTypeModel();
            
            model._id = req.body.id;
            model.short_name = req.body.short_name;
            model.name = req.body.name;
            model.code = req.body.code;
            
            let repoRoleType = new RoleType(model);
            let result = await repoRoleType.save();
            
            jsonResponse.setMessage(`${result['data'].name}  telah berhasil tersimpan.`);
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
    get_permission: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();

        try {
            let id = req.params.id
            let roleChecklist = await RoleTypeModel.findOne({_id: id}).exec();
            
            if (!roleChecklist) {
                throw new Error('Jabatan tidak ada');
            }

            let repo = new Category(roleChecklist);
            let role = {};
            
            role['details'] = await repo.getChecklistRoleSummary();
            role['role'] = roleChecklist.name;
            
            jsonResponse.setData(role);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        } catch(e) {
            console.log(e)
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    set_permission: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();

        try {
            let role = new RolePermissionModel;

            let roleChecklist = await RoleTypeModel.findOne({_id: req.body.role_id}).exec();
            role['_doc'].role_id = roleChecklist.code;
            
            let repo = new RolePermission(role);
            
            req.body = qs.parse(req.body);
            
            let detail = Object.values(req.body.detail);

            if(detail) {
                detail.forEach(x => {
                    switch(x['is_checked']) {
                        case 'true':
                            repo.check(x['_id']);
                        case 'false':
                            repo.uncheck(x['_id']);
                    }
                })
            }    

            repo.save();
            
            jsonResponse.setData(role.role_id);
            jsonResponse.setMessage('Berhasil di ubah.');

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        } catch(e) {
            console.log(e)
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    detail: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();
        try {
            let id = req.params.id;
            
            let repoUser = new User();

            let result = await repoUser.show(id);
            
            jsonResponse.setData(result);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(result));

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())

        } catch(e) {
            res.status(200).send({
                success: false,
                message: 'Failed'
            })
        }
    }
}