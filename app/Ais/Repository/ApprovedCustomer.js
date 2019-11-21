const {ObjectId} = require('mongodb'); // or ObjectID
const mongoose = require("mongoose");
const RandomString = require("../../lib/Modules/RandomString");
const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');
const UserModel = require("../../models/UserModel").User;
const CustomerTransactionModel = require("../../models/CustomerTransactionModel").CustomerTransaction;
const CustomerBalanceModel = require("../../models/CustomerBalanceModel").CustomerBalance;
const income = 500000;
var checked = [];
var unchecked = [];

class ApprovedCustomer {
    constructor(param) {
        this.param = param;
        this.data = [];
    }

    check(id)
    {
        checked.push(id);
    }

    uncheck(id)
    {
        unchecked.push(id);
    }

    async save() 
    {
        var result = [];
        
        try {
            var libRandomString = new RandomString();
            let param = this.param;

            product()

            async function product() {
                await doAll(); // Added await here
            }

            async function doAll() {
                await getChecked();
            }

            async function getChecked() 
            {
                for(let i = 0; i < checked.length; i++) {
                    const dateFormatter = new DateFormatter();
                    let row = await UserModel.findOne({_id: checked[i]}).exec();
                    
                    if(!row.approved){
                        let getInfoUser = await UserModel.findOne({_id: checked[i]}).exec();
                        
                        var descendants=[];
                        var stack=[];
                        stack.push(getInfoUser);
                        
                        while (stack.length > 0) {
                            var currentnode = await stack.pop();
                            
                            var children = UserModel.collection.find({_id: currentnode.user_id_parent});
                            while(true === await children.hasNext()) {
                                var child = await children.next();
                                await historyTransactionWithTimeout(child, currentnode);
                                await changeBalanceWithTimeout(child);
                                descendants.push(child)
                                stack.push(child);
                            }
                        }
                        await UserModel.updateOne({_id: checked[i]}, {
                            approved: true,
                            is_actived: true,
                            approved_at: dateFormatter.date(date),
                            approved_by: param.user.user_id
                        }).exec();
                    }
                }
                checked = [];
            }

            async function changeBalanceWithTimeout(param) {
                return new Promise(async function(resolve, reject) {
                    setTimeout(async () => {
                        var rowBalance = await getBalance(param);
                        const dateFormatter = new DateFormatter();
                        
                        let balanceValue = {
                            balance: (rowBalance.balance + income),
                            user_id: param._id,
                            updated_at: dateFormatter.date(date)
                        }
                        
                        mongoose.set('useFindAndModify', false);
    
                        await CustomerBalanceModel.findOneAndUpdate({user_id: param._id}, balanceValue, { upsert: true, new: true }).exec();
                        
                        resolve(rowBalance)
                    }, 7 );
                });
            }

            async function historyTransactionWithTimeout(child, currentnode) {
                return new Promise(function(resolve, reject) {
                    setTimeout(async () => {
                        let balance = await getBalance(child);

                        const dateFormatter = new DateFormatter();
                        const now = dateFormatter.date(date);
                        const findDateTrans = dateFormatter.findDate(date);
                        
                        let countDayTransations = await CustomerTransactionModel.countDocuments({user_id: child._id, created_at: { '$regex' : findDateTrans, '$options' : 'ig' }}).exec();
    
                        let counter = ((parseInt(countDayTransations) + 1) / 1000).toPrecision(10).substr(0, 5).split('.').join('');
    
                        let customerTransactionModel = new CustomerTransactionModel();
                        
                        customerTransactionModel.transaction_no = `INV_${findDateTrans}${libRandomString.makeid(4)}${counter}`;
                        customerTransactionModel.user_id = child._id;
                        customerTransactionModel.user_id_parent = currentnode._id;
                        customerTransactionModel.balance_before = (balance ? balance.balance : 0);
                        customerTransactionModel.balance_after = ((balance ? balance.balance : 0) + income);
                        customerTransactionModel.is_actived = true;
                        customerTransactionModel.balance_in = income;
                        customerTransactionModel.description = 'Downline';
                        customerTransactionModel.created_at = now;
                        customerTransactionModel.created_by = currentnode.user_id_parent;
                        
                        await customerTransactionModel.save({}, async function(err, doc) {
                            if(err)
                            console.log(err)
                        });
                        resolve(true)
                    }, 2 );
                });
            }

            async function getBalance(param)
            {
                return new Promise(function(resolve, reject) {
                    setTimeout(async () => {
                        let rowBalance = await CustomerBalanceModel.findOne({user_id: param._id}).exec();
                        
                        if(!rowBalance){
                            rowBalance = {};
                            rowBalance.balance = 0
                        }
                        
                        resolve(rowBalance);
                    }, 7 );
                });
            }
            result['status'] = true;
            result['message'] = 'Telah berhasil di setujui.';
        } catch(e) {
            console.log(e)
            result['status'] = 0;
            result['message'] = e.message;
        }
        
        return result;
    }
}

module.exports = ApprovedCustomer;