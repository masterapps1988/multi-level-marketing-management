'use strict';
var {mongoDB} = require("./Db");

mongoDB.set('useCreateIndex', true);
var Schema = mongoDB.Schema;
var PositionSchema = new Schema({
    code: {type: String, required: true, index: true, unique: true},
    name: {type: String, required: true, index: true, unique: true},
    level: {type: Number, required: true, unique: true},
    created_at: {type: String, default: ''},
    created_by: {type: Schema.Types.ObjectId},
    updated_at: {type: String, default: ''},
    updated_by: {type: Schema.Types.ObjectId}
});

var Position = mongoDB.ais_mlm.model(`positions`, PositionSchema, `positions`);
module.exports.Position = Position;