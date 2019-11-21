this.getAccessControl = require('./');
const {ObjectId} = require('mongodb'); // or ObjectID
const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');

const UserModel = require("../../models/UserModel").User;

const User = require("../../Ais/Repository/User");
const RoleType = require("../../Ais/Repository/RoleType");
const PasswordGenerate = require("../../TheBadusLibs/ThePasswordGenerate");
const JsonResponse = require("../../TheBadusLibs/JsonResponse");

module.exports.UserController = {
    profile: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();
        let repoRoleType = new RoleType();
        try {
            let result = req.user_info;
            let permission = await this.getAccessControl(req.user.user_id)
            
            result['permission'] = await permission.permission;
            result['role_type_name'] = await repoRoleType.getRoleTypeNameByCode(result.role_type);
            
            jsonResponse.setData(result);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(result));
            res.status(200).send(jsonResponse.getResponse())
        } catch(e) {
            console.log(e)
            res.status(200).send({
                success: false,
                message: 'Failed'
            })
        }
    },
    profile_update: async (req,res) => 
    {
        const jsonResponse = new JsonResponse();

        const dateFormatter = new DateFormatter();
        const now = dateFormatter.date(date);
        
        try {
            let model = new UserModel();
            
            model._id = req.body.id
            model.full_name = req.body.full_name;
            model.gender = req.body.gender;
            model.email = req.body.email;
            model.address = req.body.address;
            model.phone = req.body.phone;
            model.password = req.body.password == req.body.current_password ? req.body.current_password : PasswordGenerate(req.body.password);
            model.is_actived = true;
            model.approved = true;
            model.updated_at = req.body.id ? now : undefined;
            model.updated_by = req.body.id ? ObjectId(req.user.user_id) : undefined;

            if(!req.body.id)
                delete model['_doc']._id;
            
            let repoUser = new User(model);
            let result = await repoUser.profile_update();
            
            jsonResponse.setMessage(`${result['data'].full_name}  telah berhasil tersimpan.`);
            jsonResponse.setData(result['data']._id);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());

        } catch(e) {
            jsonResponse.setMessage('Failed');
            jsonResponse.setError(true);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
}