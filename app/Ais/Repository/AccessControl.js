const UserModel = require("../../models/UserModel").User;
const RolePermissionModel = require("../../models/RolePermissionModel").RolePermission;
const CategoryModel = require("../../models/CategoryModel").Category;
const RoleTypeModel = require("../../models/RoleTypeModel").RoleType;

class AccessControl
{
    constructor(id) {
        this.permission = this.getPermissions(id);
    }
    
    async getPermissions(id)
    {
        // Get list permissions
        let list = await UserModel.findOne({_id: id})
        .populate({
            path:'role_permission',
            model: RolePermissionModel,
            populate: [{
                path: 'category',
                model: CategoryModel
            }]
        })
        .exec()
        let category = [];
        list['role_permission'].forEach(x => {
            x.category.forEach(c => {
                let t = c.name;

                category.push(t);
            })
        })
        
        return category;
    }

    async hasAccess(name)
    {
        let getAccess = await this.permission;
        let isHasAccess = getAccess.includes(name);
        

        return isHasAccess;
    }

    async hasAccesses(listName)
    {
        let getAccess = await this.permission;
        var isHasAccess = false;
        for(var i = 0; i<getAccess.length; i++) {
            if(await this.hasAccess(listName[i])) {
                isHasAccess = true;
                break;
            } else if(listName[i] === 'none') {
                isHasAccess = true;
                break;
            }
        }
        
        return isHasAccess;
    }
}

module.exports = AccessControl;