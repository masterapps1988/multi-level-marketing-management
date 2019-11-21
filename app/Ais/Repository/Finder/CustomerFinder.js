"use strict";
const UserModel = require("../../../models/UserModel").User;
require('dotenv').config();

class CustomerFinder {
    
    constructor(param) {
        this.page = 1;
        this.per_page = 15;
        this.param = param;
        this.where = {};
        
        this.query = UserModel.find({role_type: 6});
    }

    async orderBy(columnName, orderBy)
    {
        switch(columnName) {
            case 'full_name':
                this.query = this.query.sort({ full_name : orderBy ? orderBy : 'asc'});
                break;
            default:
                this.query = this.query.sort({ created_at : orderBy ? orderBy : 'asc'});
                break;
        }
    }

    setPerPage(per_page)
    {
        this.per_page = per_page;
    }

    getPerPage()
    {
        return this.per_page;
    }

    async setPage(page)
    {
        this.page = page;
    }

    async getPage()
    {
        return this.page;
    }

    setKeyword(keyword)
    {
        if(keyword) {
            let query = [];
            // Split keyword first
            let listKeyword = keyword.split(" ");
            listKeyword = listKeyword.map(function(elem){
                return elem.trim();
            });;

            let columnList = [];
            let pattern = '';
            listKeyword.forEach(keyword => {
                pattern = `.*${keyword}.*`;
                columnList.push('full_name','username','email');
            })

            columnList.forEach(x => {
                query.push(
                    { [x]: { $regex: pattern, $options: 'si'} }
                );
            })
            
            this.query = this.query.where({$or: query});
            this.where = {$or: query};
        }
    }

    async get(param)
    {
        let where = {};
        where = this.where;
        if(Object.keys(param).length)
        where._id = param._id;

        let query = this.query;
        switch(this.page) {
            case 'all':
                return new Promise( async function (fulfilled, rejected) {
                    UserModel.countDocuments(where,function(err,count){
                        query.where(where).exec(function (err, docs) {
                            if (err) {
                                console.log(err)
                            } else {
                                var data = {
                                    data: docs,
                                    total: count,
                                    total_page: 1
                                }
                                
                                fulfilled(data)
                            }
                        });
                    });
                });
            default:
                let page = parseInt(this.page);
                let perPage = parseInt(this.per_page);

                return new Promise( async function (fulfilled, rejected) {
                    UserModel.countDocuments(where,function(err,count){
                        query.where(where).skip(page > 0 ? ((page - 1) * perPage) : 0).limit(perPage).exec(function(err, docs) {
                            if (err) {
                                console.log(err)
                            } else {
                                var data = {
                                    data: docs,
                                    current_page: page,
                                    last_page: Math.ceil(parseInt(count)/perPage),
                                    per_page: perPage,
                                    total: count,
                                    total_page: Math.ceil(parseInt(count)/perPage)
                                }
                                
                                // mongoose.connection.close();
                                fulfilled(data)
                            }
                        });
                    });
                });
        }
    }
}

module.exports = CustomerFinder;