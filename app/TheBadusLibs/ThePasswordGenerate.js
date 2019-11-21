const bcrypt = require('bcrypt');

var hash = (value)  =>
{
    var result = undefined;
    if(value)
        result = bcrypt.hashSync(value, parseInt(process.env.salt));

    return result;
}

module.exports = hash;