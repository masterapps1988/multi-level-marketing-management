'use strict';
var {mongoDB} = require("./Db");

var Schema = mongoDB.Schema;
var RoleTypeSchema = new Schema({
    code: {type: Number},
    short_name: {type: String, default: ''},
    name: {type: String, default: ''},
});

var RoleType = mongoDB.ais_mlm.model(`roleTypes`, RoleTypeSchema, `roleTypes`);
module.exports.RoleType = RoleType;