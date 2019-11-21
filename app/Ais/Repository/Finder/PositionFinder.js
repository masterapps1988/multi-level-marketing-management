"use strict";
const PositionModel = require("../../../models/PositionModel").Position;
require('dotenv').config();

class PositionFinder {
    
    constructor(param) {
        this.page = 1;
        this.per_page = 15;
        this.param = param;
        
        this.query = PositionModel.find({});
    }

    async orderBy(columnName, orderBy)
    {
        switch(columnName) {
            case 'code':
                this.query = this.query.sort({ code : orderBy ? orderBy : 'asc'});
                break;
            case 'name':
                this.query = this.query.sort({ name : orderBy ? orderBy : 'asc'});
                break;
            case 'level':
                this.query = this.query.sort({ level : orderBy ? orderBy : 'asc'});
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

    async get()
    {
        let query = this.query;
        switch(this.page) {
            case 'all':
                return new Promise( async function (fulfilled, rejected) {
                    PositionModel.countDocuments({},function(err,count){
                        query.exec(function (err, docs) {
                            if (err) {
                                console.log(err)
                            } else {
                                var data = {
                                    data: docs,
                                    total: count,
                                    total_page: 1
                                }
                                
                                // mongoose.connection.close();
                                fulfilled(data)
                            }
                        });
                    });
                });
            default:
                let page = parseInt(this.page);
                let perPage = parseInt(this.per_page);

                return new Promise( async function (fulfilled, rejected) {
                    PositionModel.countDocuments({},function(err,count){
                        query.skip(page > 0 ? ((page - 1) * perPage) : 0).limit(perPage).exec(function(err, docs) {
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

module.exports = PositionFinder;