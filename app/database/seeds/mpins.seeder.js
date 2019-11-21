var { Seeder } = require('mongoose-data-seed');
const Model = require("../../models/MpinModel").Mpin;

const data = [{

}];

class MpinsSeeder extends Seeder {

  async shouldRun() {
    return Model.deleteMany({}).exec();
  }

  async run() {
    return true;
  }
}

module.exports = MpinsSeeder;
