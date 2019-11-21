const {ObjectId} = require('mongodb'); // or ObjectID
const mongoose = require("mongoose");
const RoleTypeModel = require("../../models/RoleTypeModel").RoleType;

class RoleType {
    constructor(param) {
        this.param = param;
        this.data = [];
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
                RoleTypeModel.findOneAndUpdate({_id: currentId}, params, { upsert: true, new: true }, (err, doc) => {
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

    async getRoleTypeNameByCode(code)
    {
        let result = '';
        let row = await RoleTypeModel.findOne({code: code}).exec();
        if(row)
        result = row.short_name;

        return result;
    }
}

module.exports = RoleType;