const RoleTypeFinder = require("../../Ais/Repository/Finder/RoleTypeFinder");
const JsonResponse = require("../../TheBadusLibs/JsonResponse");

module.exports.RoleTypeController = {
    index: async (req,res) => 
    {
        let finder = new RoleTypeFinder(req.query);
        let jsonResponse = new JsonResponse();
        try {
            if(req.query.per_page)
                finder.setPerPage(req.query.per_page);

            if(req.query.page)
                finder.setPage(req.query.page);

            if(req.user.is_admin) {
                finder.setStatusId([2, 4])
            } else {
                finder.setStatusId([4])
            }
            
            if(req.query.order_by) {
                finder.orderBy(req.query.order_by['column'], req.query.order_by['ordered']);
            } else {    
                finder.orderBy('created_at', 'desc');
            }
            
            var paginator = await finder.get();
            
            let rows = [];
            paginator.data.forEach(x => {
                let u = {
                    code: String(x.code),
                    name: x.name,
                    short_name: x.short_name
                }

                rows.push(u);
            })

            jsonResponse.setData(rows);
            jsonResponse.setMeta(jsonResponse.getPaginatorConfig(paginator));

            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        } catch(e) {
            jsonResponse.setMessage(e.message);
            jsonResponse.setError(true);
            
            if(!res.headersSent)
            res.status(200).send(jsonResponse.getResponse());
        }
    }
}