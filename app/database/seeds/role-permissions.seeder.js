var { Seeder } = require('mongoose-data-seed');
const DateFormatter = require("../../lib/Modules/DateFormatter");
const date = require('moment');
const dateFormatter = new DateFormatter();
const now = dateFormatter.date(date);

const Model = require("../../models/RolePermissionModel").RolePermission;
const RoleTypeModel = require("../../models/RoleTypeModel").RoleType;
const CategoryModel = require("../../models/CategoryModel").Category;
var fs = require('fs');
const path = require("path");


class RolePermissionsSeeder extends Seeder {

  async shouldRun() {
    // return Model.countDocuments().exec().then(count => count === 0);
    return Model.deleteMany({}).exec();
  }

  async run() {
      var data = fs.readFileSync(path.resolve(__dirname, '../csv/role-permission.csv'))
      .toString() // convert Buffer to string
      .split('\n') // split string to lines
      .map(e => e.trim()) // remove white spaces for each line
      .map(e => e.split(',').map(e => e.trim())); // split each line to array
      
      let lines = JSON.parse(JSON.stringify(data, '', 2));
      let rows = await this.generateList(lines);

      return Model.create(rows);
  }

  async generateList(lines)
    {
      try {
        let created = now;

        // Get header
        let header = lines[0];
        var rowsPermission = await CategoryModel.find({group_by: 'permission'}).exec();
        var rowsRoleTypes = await RoleTypeModel.find({}).exec();
        
        var permissionId = (y) => {
          let w = [];
          for(let i = 0;i<rowsPermission.length;i++) {
            if(rowsPermission[i].name == y) {
              w.push(rowsPermission[i]._id)
              break;
            }
          };
          return w;
        }
        
        let roleTypeCode = (x) => {
          let w = [];
          for(let i = 0;i<rowsRoleTypes.length;i++) {
            if(String(rowsRoleTypes[i].name).toLowerCase() == x) {
              w.push(rowsRoleTypes[i].code)
              break;
            }
          };
          return w;
        }
        
        var rows = [];
        header.forEach(async (x, key) => {
          lines.forEach(async (c, i) => {
            let y = lines[i + 1] ? String(lines[i + 1][key]).toLowerCase() : null;
            
            // Not all each roles/column has value
            if(y) {
              let u = {
                  role_id: roleTypeCode(x)[0],
                  permission_id: permissionId(y)[0],
                  created_at: created,
                  updated_at: created
              };
              
              rows.push(u);

            }
          })
        })

        return rows;
      } catch(e) {
        console.log(e)
      }
        
    }
}

module.exports = RolePermissionsSeeder;
