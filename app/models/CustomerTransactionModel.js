'use strict';
var {mongoDB} = require("./Db");

var Schema = mongoDB.Schema;
var CustomerTransactionSchema = new Schema({
    transaction_no: {type: String, default: ''},
    user_id: {type: Schema.Types.ObjectId},
    user_id_parent: {type: Schema.Types.ObjectId},
    balance_before: { type: Number, default: 0 },
    balance_after: { type: Number, default: 0 },
    balance_in: { type: Number, default: 0 },
    description: {type: String, default: ''},
    created_at: {type: String, default: ''},
    created_by: {type: String, default: ''}
});

CustomerTransactionSchema.virtual('user',{
    ref: 'users',
    localField: 'user_id',
    foreignField: '_id',
    justOne: true
});

CustomerTransactionSchema.virtual('parent',{
    ref: 'users',
    localField: 'user_id_parent',
    foreignField: '_id',
    justOne: true
});

CustomerTransactionSchema.set('toObject', { virtuals: true });
CustomerTransactionSchema.set('toJSON', { virtuals: true });

var CustomerTransaction = mongoDB.ais_mlm.model(`customerTransactions`, CustomerTransactionSchema, `customerTransactions`);
module.exports.CustomerTransaction = CustomerTransaction;