'use strict';
var {mongoDB} = require("./Db");

var Schema = mongoDB.Schema;
var RolePermissionSchema = new Schema({
    role_id: {type: Number},
    permission_id: {type: Schema.Types.ObjectId},
    created_at: {type: String, default: ''},
    updated_at: {type: String, default: ''}
});

RolePermissionSchema.virtual('category',{
    ref: 'categories',
    localField: 'permission_id',
    foreignField: '_id',
    default: {}
});

RolePermissionSchema.set('toObject', { virtuals: true });
RolePermissionSchema.set('toJSON', { virtuals: true });

var RolePermission = mongoDB.ais_mlm.model(`rolePermissions`, RolePermissionSchema, `rolePermissions`);
module.exports.RolePermission = RolePermission;