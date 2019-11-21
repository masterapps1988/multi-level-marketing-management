const CustomerBalanceModel = require("../../models/CustomerBalanceModel").CustomerBalance;

class Customer {
    constructor(param) {
        this.param = param;
        this.data = [];
    }

    async getBalanceById(user_id)
    {
        let row = await CustomerBalanceModel.findOne({user_id: user_id}).exec();

        return row;
    }
}

module.exports = Customer;