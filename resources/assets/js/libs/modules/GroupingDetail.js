var GroupingDetail = function(details) {
    this.details = details;

    // Grouping quote details
    this._groupingDetail = function(details) {
        var list = [];
        var i, x;
        var group;
        var total = 0;

        for(i=0; i<details.length; i++) {
            x = details[i];
            x.price_profit = parseFloat(x.price_profit);
            x.qty = parseFloat(x.qty);

            group = list.find(function(el) {
                return el.name === x.group_by;
            });

            if(group){
                total += x.price_profit * x.qty;
                group.detail.push(x);
                group.total = total;
            }else{
                total = x.price_profit * x.qty;
                list.push({
                    name: x.group_by,
                    total : total,
                    detail: [x]
                });
            }
        }
        return list;
    };

    this.get = function() {
        return this._groupingDetail(this.details);
    };
};
