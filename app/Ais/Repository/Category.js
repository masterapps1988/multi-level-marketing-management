const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');
const {ObjectId} = require('mongodb'); // or ObjectID
const mongoose = require("mongoose");
const CategoryModel = require("../../models/CategoryModel").Category;
const RolePermissionModel = require("../../models/RolePermissionModel").RolePermission;

var ValidationError = require('validation-error');
const v = require('node-input-validator');
const { Validator } = require('node-input-validator');

class Category {
    constructor(param) {
        this.param = param;
        this.data = [];
    }

    async getChecklistRoleSummary()
    {
        let category = await CategoryModel.find({group_by: 'permission'}).exec();
        
        let list = await Promise.all(
            category.map(async x => {
                let listChecklistModel = await RolePermissionModel.countDocuments({'permission_id': x._id,'role_id': this.param.code}).exec();
                
                let data = {
                    id: x._id,
                    label: x.label,
                    is_checked: listChecklistModel ? true : false
                };
                
                return data;
            })
        )
        
        
        return list;
    }
}

module.exports = Category;