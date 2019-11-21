var { Seeder } = require('mongoose-data-seed');
const Model = require("../../models/PositionModel").Position;

const data = [{
    code: "DHU",
    name: "DUTA HAJI UMROH",
    level: 1
  },
  {
    code: "TL",
    name: "TEAM LEADER",
    level: 3
  },
  {
    code: "SPV",
    name: "SUPERVISOR",
    level: 6
  },
  {
    code: "M",
    name: "MANAGER",
    level: 8
  },
  {
    code: "SM",
    name: "SENIOR MANAGER",
    level: 9
  },
  {
    code: "AD",
    name: "ASISTEN DIREKTUR",
    level: 10
  }];

class PositionsSeeder extends Seeder {

  async shouldRun() {
    // return Model.countDocuments().exec().then(count => count === 0);
    return Model.deleteMany({}).exec();
  }

  async run() {
    return Model.create(data);
  }
}

module.exports = PositionsSeeder;
