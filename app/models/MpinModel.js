'use strict';
var {mongoDB} = require("./Db");

mongoDB.set('useCreateIndex', true);
var Schema = mongoDB.Schema;
var MpinSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, default: null},
    mpin: {type: String, index: true, unique: true},
    is_used: {type: Boolean, default: false},
    is_actived: {type: Boolean, default: true},
    used_at: {type: String, default: ''},
    used_by: {type: Schema.Types.ObjectId, default: null},
    created_at: String,
    created_by: {type: Schema.Types.ObjectId}
});

MpinSchema.virtual('user',{
    ref: 'users',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

MpinSchema.set('toObject', { virtuals: true });
MpinSchema.set('toJSON', { virtuals: true });

var Mpin = mongoDB.ais_mlm.model(`mpins`, MpinSchema, `mpins`);
module.exports.Mpin = Mpin;