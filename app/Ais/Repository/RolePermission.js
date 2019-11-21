const {ObjectId} = require('mongodb'); // or ObjectID
const mongoose = require("mongoose");
const RolePermissionModel = require("../../models/RolePermissionModel").RolePermission;
var checked = [];
var unchecked = [];
var detail = [];

class RolePermission {
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
            // Unchecked
            await RolePermissionModel.deleteMany({'role_id': this.param.role_id, 'permission_id': {$in: unchecked}}, function(err, doc) {
                if(err)
                console.log(err)
                if(!err)
                unchecked = [];
            });
            
            await Promise.all(
                checked.map(async x => {
                    let role = new RolePermissionModel;
                    
                    role.permission_id = x;
                    role.role_id = this.param.role_id;
                    
                    await role.save({}, function(err, doc) {
                        if(err) console.log(err)
                    });
                    checked.pop();
                })
            )
            
            // if(unchecked.length)
            // unchecked.pop();
            // if(checked.length)
            
        } catch(e) {
            console.log(e)
            result['status'] = 0;
            result['message'] = e.message;
            
        }
        
        return result;
    }
}

module.exports = RolePermission;