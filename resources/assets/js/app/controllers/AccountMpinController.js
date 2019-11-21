(function() {
    'use strict';
    
    angular.module('app').controller('AccountMpinController', AccountMpinController);
    
    function AccountMpinController($state, $stateParams, ApiService, LoadingService,
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
    
        this.setTitle = function() {
            this.titleRole = "List MPin";
        };
        
        this.init = function() {
            this.setTitle();
            this.getCustomer();
            var search = {};
    
            if($stateParams.role) {
                search.roles = $stateParams.role;
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
    
        // Search User
        this._doSearch = function() {
            vm.ls.get('loading').on();
            ApiService.Account.Mpin.all(vm.search).then(function(resp) {
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
                
                $state.go('dashboard');
            });
        };

        this.showPage = function(page) {
            this.search.page = page;
            this.doSearch();
        };
    
        // Redirect to correct route
        this.doSearch = function() {
            this.search.order_by = this.orderBy.toString();
           
            $state.go('account-mpin', this.search);  
            
        };

        this.getCustomer = function() {
            ApiService.Customer.all({page: 'all', order_by: {column: 'full_name', ordered: 'asc'}}).then(function(resp) {
                var data = resp.data;
                
                vm.customers = data.data;
                vm.customers.id = String(vm.customers.id);
            }).catch(function (error){
                vm.fm.error(error.data.errors[0]);
            });
        };

        // Redirect to correct route
        this.genMpin = function() {
            ApiService.Account.Mpin.gen(this.gen_mpin).then(function(resp) {
                if(!resp.data.is_error) {
                    vm.init();
    
                    vm.fm.success(resp.data.message);
                } else {
                    vm.fm.error(resp.data.message);
                }
                
                vm.ls.get('loading').off();
            }).catch(function (error){
                console.log(error)
                vm.fm.error(error.data.errors[0]);
                
                $state.go('account-mpin', {state: 'account-mpin'});
                vm.ls.get('loading').off();
            });
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