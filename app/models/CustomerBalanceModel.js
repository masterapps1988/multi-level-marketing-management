'use strict';
var {mongoDB} = require("./Db");

mongoDB.set('useCreateIndex', true);
var Schema = mongoDB.Schema;
var CustomerBalanceSchema = new Schema({
    balance: {type: Number, default: 0},
    user_id: {type: Schema.Types.ObjectId, index: true, unique: true},
    created_at: {type: String, default: ''},
    updated_at: {type: String, default: ''},
});

CustomerBalanceSchema.virtual('customer_transaction',{
    ref: 'customerTransactions',
    localField: 'user_id',
    foreignField: 'user_id',
    // justOne: true
});

CustomerBalanceSchema.set('toObject', { virtuals: true });
CustomerBalanceSchema.set('toJSON', { virtuals: true });

var CustomerBalance = mongoDB.ais_mlm.model(`customerBalances`, CustomerBalanceSchema, `customerBalances`);
module.exports.CustomerBalance = CustomerBalance;