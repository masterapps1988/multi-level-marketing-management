'use strict';
var {mongoDB} = require("./Db");

var Schema = mongoDB.Schema;
var CategorySchema = new Schema({
    category_id: {type: Number},
    name: {type: String, default: ''},
    label: {type: String, default: ''},
    notes: {type: String, default: ''},
    group_by: {type: String, default: ''},
    created_at: {type: String, default: ''},
    updated_at: {type: String, default: ''}
});

var Category = mongoDB.ais_mlm.model(`categories`, CategorySchema, `categories`);
module.exports.Category = Category;