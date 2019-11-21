const JsonResponse = require("../../TheBadusLibs/JsonResponse");

const User = require("../../Ais/Repository/User");
const DownlineEarningHistoryFinder = require("../../Ais/Repository/Finder/DownlineEarningHistoryFinder");

module.exports.ProfitController = {
    index_hierarchy: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();

        let repoUser = new User();
        try {
            let id = '';
            
            if(parseInt(req.user_info.role_type) != 2) {
                id = req.user.user_id;
            } else {
                id = req.query.keyword;
            }
            
            let result = await repoUser.getAllParentUser(id);

            jsonResponse.setData(result['data']);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(result));

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
            
        } catch(e) {
            jsonResponse.setMessage(e.message);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    index_downline_earning: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();

        try {
            let id = '';
            
            if(parseInt(req.user_info.role_type) != 2) {
                id = {user_id: req.user.user_id};
                
            } else {
                id = {user_id: req.query.keyword};
            }
            
            let finder = new DownlineEarningHistoryFinder(id);

            if(req.query.per_page)
                finder.setPerPage(req.query.per_page);

            if(req.query.page)
                finder.setPage(req.query.page);
            
            if(req.query.keyword)
                finder.setKeyword(req.query.keyword);
            
            if(req.query.order_by) {
                finder.orderBy(req.query.order_by['column'], req.query.order_by['ordered']);
            } else {    
                finder.orderBy('created_at', 'desc');
            }
            
            var paginator = await finder.get();
            
            let list = {};
            list.rows = [];
            let sumBalanceIn = 0;
            paginator.data.forEach(x => {
                sumBalanceIn += x.balance_in;
                list.rows.push({
                    _id: x._id,
                    transaction_no: x.transaction_no,
                    description: x.description,
                    user_id: x.user_id,
                    balance_before: x.balance_before,
                    balance_after: x.balance_after,
                    balance_in: x.balance_in,
                    full_name: x.user ? x.user.full_name : '',
                    parent_id: x.user_id_parent,
                    parent_full_name: x.parent ? x.parent.full_name : '',
                    created_at: x.created_at,
                    created_by: x.created_by
                })
            })
            list.total_balance_in = list.total_balance_in || [];
            list.total_balance_in = sumBalanceIn;
            
            jsonResponse.setData(list);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(paginator));

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
            
        } catch(e) {
            jsonResponse.setMessage(e.message);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    },
    count_downline_earning: async (req,res) => 
    {
        let jsonResponse = new JsonResponse();

        try {
            let id = '';
            
            if(parseInt(req.user_info.role_type) != 2) {
                id = {user_id: req.user.user_id};
                
            } else {
                id = {};
            }
            
            let finder = new DownlineEarningHistoryFinder(id);

            var paginator = await finder.get();
            
            let total = {
                total: paginator.data.length
            }
            
            jsonResponse.setData(total);

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse())
            
        } catch(e) {
            jsonResponse.setMessage(e.message);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    }
}