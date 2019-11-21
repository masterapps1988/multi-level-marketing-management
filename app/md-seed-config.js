var mongoose = require("mongoose");
var Users = require('./database/seeds/users.seeder');
var Positions = require('./database/seeds/positions.seeder');
var RoleTypes = require('./database/seeds/role-types.seeder');
var RolePermissions = require('./database/seeds/role-permissions.seeder');
var Categories = require('./database/seeds/categories.seeder');
var Mpins = require('./database/seeds/mpins.seeder');
var UserLoggeds = require('./database/seeds/user-loggeds.seeder');

const mongoURL = process.env.MONGO_URL || 'mongodb://localhost:27017/ais_mlm?authSource=admin';

/**
 * Seeders List
 * order is important
 * @type {Object}
 */
module.exports.seedersList = {
  Users,
  Positions,
  Categories,
  RoleTypes,
  RolePermissions,
  Mpins,
  UserLoggeds
};
/**
 * Connect to mongodb implementation
 * @return {Promise}
 */
module.exports.connect = async () => {
  await mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true });
}
  
/**
 * Drop/Clear the database implementation
 * @return {Promise}
 */
module.exports.dropdb = async () => {
  mongoose.connection.db.dropDatabase();
} 
