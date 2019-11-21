const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');
const {ObjectId} = require('mongodb'); // or ObjectID
const mongoose = require("mongoose");
const CategoryModel = require("../../models/CategoryModel").Category;
const UserModel = require("../../models/UserModel").User;

var ValidationError = require('validation-error');
const v = require('node-input-validator');
const { Validator } = require('node-input-validator');

class Permission {
    constructor(param) {
        this.param = param;
        this.data = [];
    }

    async getDetailPermission(username) 
    {
        var x = new Promise( function (fulfilled, rejected) {
            CategoryModel.findOne({username: username, is_actived: true, approved: true}, function(err, data) {
                if(err) rejected(err)
                
                
                fulfilled(data);
            })
        });

        return x;
    }

    async save() 
    {
        var result = [];
        
        try {
            mongoose.set('useFindAndModify', false);

            let params = this.param;

            params= JSON.stringify(params, function (key, value) {return (value === '') ? undefined : value});
            params= JSON.parse(params)
            
            var currentId;
            if (params._id) {
                currentId = params._id;
                delete params._id;
            } else {
                currentId = ObjectId();
            }

            let data = {};
            
            return new Promise( function (fulfilled, rejected) {
                CategoryModel.findOneAndUpdate({_id: currentId}, params, { upsert: true, new: true }, (err, doc) => {
                    if(err) {
                        rejected(err)
                    }

                    if(doc){
                        data = doc['_doc'];

                        result['status'] = 1;
                        result['message'] = 'Success';
                        result['data'] = data
                        
                        fulfilled(result)
                    }
                    
                });
            });
        } catch(e) {
            console.log(e)
            result['status'] = 0;
            result['message'] = e.message;
            
        }
        
        return result;
    }
}

module.exports = Permission;