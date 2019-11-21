(function() {
    'use strict';
    
    angular.module('app').controller('ProfitDownlineEarningController', ProfitDownlineEarningController);
    
    function ProfitDownlineEarningController($state, $stateParams, ApiService, LoadingService,
    FlashMessageService, BalanceService) {
        var vm = this;
        this.bl = BalanceService
        this.search = {};
        this.message = null;
        this.orderBy = new OrderBy();
    
        // Paginator
        this.paginator = {};
        
        this.fm = FlashMessageService;
        this.ls = LoadingService;
    
        // Warranty card
        this.list = null;
        this.selectedHash = null;
        this.propertyName = 'label';
        this.reverse = true;
        this.prop = 0;

        this.setTitle = function() {
            this.titleRole = "List Transaction";
        };

        this.init = function() {
            this.setTitle();
            var search = {};
            
            if($stateParams.created)
                search.created = $stateParams.created;
            if($stateParams.is_actived)
                search.is_actived = $stateParams.is_actived;
            if($stateParams.approved)
                search.approved = $stateParams.approved;
            if($stateParams.page)
                search.page = $stateParams.page;
            if($stateParams.keyword)
                search.keyword = $stateParams.keyword;
    
            // Order By
            if($stateParams.order_by) {
                var list = $stateParams.order_by.split(':');
                search.order_by = {};
                search.order_by.column = list[0];
                search.order_by.ordered = list[1];
    
                // Generate sort
                this.orderBy.data.columnName = list[0];
                this.orderBy.data.order = list[1] == 'asc';
            }
    
            vm.search = search;
    
            vm._doSearch();
    
            vm.prop = 1;
        };

        // Search User
        this._doSearch = function() {
            vm.ls.get('loading').on();
            
            ApiService.Profit.DownlineEarning.all(vm.search).then(function(resp) {
                var data = resp.data;
                vm.list = data.data;
                if(parseInt(vm.search.page) > data._meta.last_page){
                    // Redirect to last_page
                    vm.search.page = data._meta.last_page;
                    vm.doSearch();
                }
    
                // Paginator
                vm.paginator = Paginator(data);
    
                vm.ls.get('loading').off();
            }).catch(function (error){
                vm.fm.error(error.data.errors[0]);
                // vm.message = error.data.errors;
                $state.go('profit-downline-earning');
            });
        };

        this.showPage = function(page) {
            this.search.page = page;
            this.doSearch();
        };
    
        // Redirect to correct route
        this.doSearch = function() {
            console.log('search', this.search);
            this.search.order_by = this.orderBy.toString();
           
            $state.go('profit-downline-earning', this.search);  
            
        };

        this.sortBy = function(columnName) {
            this.orderBy.setColumn(columnName);
    
            // Generate search params
            this.search.order_by = this.orderBy.toString();
            this.doSearch();
        };
    
        this.getOrderBy = function(columnName) {
            return this.orderBy.getClass(columnName);
        };
    
    };
})();