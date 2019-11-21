'use strict';
var {mongoDB} = require("./Db");

var Schema = mongoDB.Schema;
var UserSchema = new Schema({
    full_name: String,
    username: String,
    user_id_parent: {type: Schema.Types.ObjectId, default: null},
    password: String,
    gender: {type: Number, default: 1},
    address: {type: String, default: ''},
    email: {type: String, default: ''},
    role_type: {type: Number, default: 6},
    mpin: {type: String, default: ''},
    phone: {type: String, default: ''},
    is_actived: {type: Boolean, default: false},
    approved: {type: Boolean, default: false},
    approved_at: {type: String, default: ''},
    approved_by: {type: Schema.Types.ObjectId},
    created_at: {type: String, default: ''},
    created_by: {type: Schema.Types.ObjectId},
    updated_at: {type: String, default: ''},
    updated_by: {type: Schema.Types.ObjectId},
});

UserSchema.virtual('role_permission',{
    ref: 'rolePermissions',
    localField: 'role_type',
    foreignField: 'role_id',
    default: {}
});

UserSchema.virtual('role_type_code',{
    ref: 'roleTypes',
    localField: 'role_type',
    foreignField: 'code',
    justOne: true
});

UserSchema.set('toObject', { virtuals: true });
UserSchema.set('toJSON', { virtuals: true });

var User = mongoDB.ais_mlm.model(`users`, UserSchema, `users`);
module.exports.User = User;