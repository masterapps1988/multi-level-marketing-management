const AccessControl = require("../../Ais/Repository/AccessControl");

var getAccessControl = (id) =>
{
    if(id)
        return new AccessControl(id);

    return null;
}

module.exports = getAccessControl;