(function() {
    'use strict';
    
    angular.module('app').controller('ProfitHierarchyController', ProfitHierarchyController);
    
    function ProfitHierarchyController($state, $stateParams, ApiService, LoadingService,
    FlashMessageService, AccessControlService) {
        var vm = this;

        this.ac = AccessControlService;
        
        this.search = {};
        this.message = null;

        this.fm = FlashMessageService;
        this.ls = LoadingService;
    
        // Warranty card
        this.list = null;
        this.selectedHash = null;
        this.propertyName = 'label';
        this.reverse = true;
        this.prop = 0;
    
        this.init = function() {
            vm.ls.get('loading').on();
            this.getCustomer();
            var search = {};

            if($stateParams.keyword)
                search.keyword = $stateParams.keyword;
            
            vm.search = search;
            vm._doSearch();
        };

        this.setOrgChart = function() {
            
            var nodeTemplate = function(param) {
                return '<div class="office">'+param.full_name+'</div>'+
                    '<div class="title">'+param.depth+'</div>'+
                    '<div><img src="'+param.gender+'" class="user-image" alt="User Image" /></div>'
                ;
            };

            new OrgChart({
                element:'chart-container',
                data: vm.data,
                nodeTemplate: nodeTemplate(vm.data)
            });
        }

        // Search User
        this._doSearch = function() {
            vm.ls.get('loading').on();
            
            ApiService.Profit.Hierarchy.get(this.search).then(function(resp) {
                if(!resp.data.is_error) {
                    var data = resp.data.data;
                    vm.data = data;
                    vm.setOrgChart()
                } else {
                    vm.error.on();
                    vm.message = resp.data.errors;
                    $state.go('dashboard');
                }
            }).catch(function (error){
                console.log(error)
                vm.fm.error(error.data.errors[0]);
                
                $state.go('dashboard');
            });
            vm.ls.get('loading').off();
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
        this.doSearch = function() {

            $state.go('profit-hierarchy', this.search);  
        };
    };
})();