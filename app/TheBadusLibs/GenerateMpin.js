const RandomString = require("../lib/Modules/RandomString");
const DateFormatter = require("../lib/Modules/DateFormatter");
const date = require('moment');
const {ObjectId} = require('mongodb'); // or ObjectID

var gen = function(name) {
    const dateFormatter = new DateFormatter();
    
    var randomString = new RandomString();

    var nameCodeShortname = name.substring(0, 4);
    if(nameCodeShortname.length < 4) {
        nameCodeShortname += randomString.makeString(4 - nameCodeShortname.length)
    }

    nameCodeShortname = nameCodeShortname.toUpperCase();

    let a = ( parseInt(dateFormatter.date(date)) + randomString.makeString(4) + String(ObjectId()).substring(5, 3) );
    let z = '';
    for(var i = 1; i <= (20 - parseInt(a.toString().length)); i++) {
        z+= Math.floor(Math.random() * 9);
    }

    let b = `${a}${z}`;

    result = `${nameCodeShortname}${b.substring(0, 14)}`;

    return result;
}

module.exports.genMpin = gen;