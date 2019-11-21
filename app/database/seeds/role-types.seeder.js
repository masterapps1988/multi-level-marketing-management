var { Seeder } = require('mongoose-data-seed');
var faker = require('faker');
const {ObjectId} = require('mongodb'); // or ObjectID
const Model = require("../../models/RoleTypeModel").RoleType;

const data = [{
    code: 2,
    short_name: 'admin',
    name: 'Admin'
  },
  {
    code: 4,
    short_name: 'operator',
    name: 'Operator'
  },
  {
    code: 6,
    short_name: 'customer',
    name: 'Customer'
  }];

class RoleTypesSeeder extends Seeder {

  async shouldRun() {
    // return Model.countDocuments().exec().then(count => count === 0);
    return Model.deleteMany({}).exec();
  }

  async run() {
    return Model.create(data);
  }
}

module.exports = RoleTypesSeeder;
