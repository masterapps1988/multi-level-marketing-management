var { Seeder } = require('mongoose-data-seed');
const Model = require("../../models/UserLoggedModel").userLogged;

const data = [{

}];

class UserLoggedsSeeder extends Seeder {

  async shouldRun() {
    return Model.deleteMany({}).exec();
  }

  async run() {
    return true;
  }
}

module.exports = UserLoggedsSeeder;
