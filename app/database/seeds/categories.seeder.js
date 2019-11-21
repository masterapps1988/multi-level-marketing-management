var { Seeder } = require('mongoose-data-seed');
const {ObjectId} = require('mongodb'); // or ObjectID
const Model = require("../../models/CategoryModel").Category;
var fs = require('fs');
const path = require("path");

class CategoriesSeeder extends Seeder {

  async shouldRun() {
    
    return Model.deleteMany({}).exec();
  }

  async run() {
    var data = fs.readFileSync(path.resolve(__dirname, '../csv/category.csv'))
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => e.split(',').map(e => e.trim())); // split each line to array
    
    let categoryCSV = JSON.parse(JSON.stringify(data, '', 2));
    
    let rows = [];
    categoryCSV.forEach( (x) => {
      if (x) {
        let u = {
          id: x[0],
          name: x[1].toLowerCase(),
          label: x[2],
          notes: x[3],
          group_by: x[4]
        };

        rows.push(u)
      }
    });
    
    return Model.create(rows);
  }
}

module.exports = CategoriesSeeder;
