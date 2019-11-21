'use strict';
var {mongoDB} = require("./Db");

var Schema = mongoDB.Schema;
var userLoggedSchema = new Schema({
    created_at: String,
    jwt_encrypt: String,
    role_type: Number,
    user_id: {type: Schema.Types.ObjectId},
    username: String
});

userLoggedSchema.virtual('user',{
    ref: 'users',
    localField: 'user_id',
    foreignField: '_id',
    default: {}
});

userLoggedSchema.set('toObject', { virtuals: true });
userLoggedSchema.set('toJSON', { virtuals: true });

var userLogged = mongoDB.ais_mlm.model(`userLogged`, userLoggedSchema, `userLogged`);
module.exports.userLogged = userLogged;