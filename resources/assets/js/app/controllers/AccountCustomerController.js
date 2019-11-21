(function() {
    'use strict';
    
    angular.module('app').controller('AccountCustomerController', AccountCustomerController);
    
    function AccountCustomerController($state, $stateParams, ApiService, LoadingService,
    FlashMessageService, AccessControlService) {
        var vm = this;
        
        this.ac = AccessControlService;
    
        this.search = {};
        this.message = null;
        this.orderBy = new OrderBy();
    
        this.titleRole = null;
        this.role = $stateParams.role;
        
        // Paginator
        this.paginator = {};
    
        this.fm = FlashMessageService;
        this.ls = LoadingService;
    
        this.list = null;
    
        this.createEmptyData = function() {
            this.data = {
                full_name: null,
                username: null,
                user_id_parent: null,
                password: null,
                gender: null,
                address: null,
                email: null,
                role_type: null,
                phone: null,
                is_actived: null,
                approved: null,
                created_at: null,
                created_by: null,
                updated_at: null,
                updated_by: null,
            };
        };

        this.setTitle = function() {
            this.titleRole = "List Customer";
        };
        
        this.init = function() {
            this.createEmptyData();
            this.setTitle();
            var search = {};
    
            // If role is NOT empty then this mean is NOT admin
            if($stateParams.role){
                search.roles = $stateParams.role; // Get only 1 role from $role variable
                this.data.role = $stateParams.role;
            }

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
        };

        // Search Customer
        this._doSearch = function() {
            vm.ls.get('loading').on();
            ApiService.Customer.all(vm.search).then(function(resp) {
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
                $state.go('account-customer');
            });
        };

        this.showPage = function(page) {
            this.search.page = page;
            this.doSearch();
        };
    
        // Redirect to correct route
        this.doSearch = function() {
            this.search.order_by = this.orderBy.toString();
           
            $state.go('account-customer', this.search);  
            
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