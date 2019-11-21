(function() {
    'use strict';
    
    angular.module('app').controller('AccountStatusController', AccountStatusController);
    
    function AccountStatusController($state, $stateParams, ApiService, LoadingService,
    FlashMessageService, BalanceService) {
        var vm = this;
    
        this.search = {};
        this.message = null;
        this.orderBy = new OrderBy();
    
        // Paginator
        this.paginator = {};
        this.list = [];
        this.isStatus = true;

        this.fm = FlashMessageService;
        this.ls = LoadingService;
    
        // Warranty card
        this.list = null;
        this.selectedHash = null;
        this.propertyName = 'label';
        this.reverse = true;
        this.prop = 0;
    
        this.createEmptyData = function() {
            this.data = [];
        };
    
        this.init = function() {
            console.log('Status list init');
            this.createEmptyData();
            this.selectedHash = null;
            var search = {};
            vm.search = search;

            if($stateParams.created)
                search.created = $stateParams.created;
            if($stateParams.status)
                search.status = $stateParams.status;
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
    
        // Search Status
        this._doSearch = function() {
            vm.ls.get('loading').on();
            
            ApiService.Account.Status.all(this.search).then(function(resp){
                var data = resp.data;
                vm.list = data.data;
                
                if(parseInt(vm.search.page) > data._meta.last_page){
                    // Redirect to last_page
                    vm.search.page = data._meta.last_page;
                    vm.doSearch();
                }

                vm.paginator = Paginator(data);
                vm.isStatus = vm.isSelectedAll();

                vm.ls.get('loading').off();
            });
        };

        this.showPage = function(page) {
            this.search.page = page;
            this.doSearch();
        };
    
        // Redirect to correct route
        this.doSearch = function() {
            this.search.order_by = this.orderBy.toString();
            $state.go('account-status', this.search);
        };

        // Submit to DB Approved
        this.submit = function() {
            vm.ls.get('loading').on();
            var postData = this._createPostData(this.data);
            
            ApiService.Account.Status.approved(postData).then(function(resp){
                if(!resp.data.is_error) {
                    
                    vm.fm.success(resp.data.message);
                    BalanceService.refresh();
                    vm.init();
                } else {
                    vm.fm.error(resp.data.message);
                }
                
                vm.ls.get('loading').off();
            }).catch(function (error){
                vm.fm.error(error.data.errors[0]);
                
                $state.go('account-status');
                vm.ls.get('loading').off();
            });
        };
    
        // Add blank role
        this.add = function(x) {
            var addParam = {
                _id: x._id,
                approved: x.approved,
                _hash: Math.getRandomHash()
            };
            
            this.data.push(addParam);
        };

        this._createPostData = function(data)
        {
            var postData = {
                detail: data
            }
            for(var i=0; i<data.length; i++) {
                delete data[i]._hash;
                delete data[i].is_edit;
                delete data[i].$$hashKey;
            }

            return postData;
        };

        // if detail is selected all
        this.isSelectedAll = function() {
            var isSelectedAll = true;
            for(var x = 0;x < vm.list.length;x++) {
                if (vm.list[x].approved != false) {
                    isSelectedAll = false;
                    break;
                }
            }
            
            return isSelectedAll;
        };

        // Select all checkbox
        this.selectAll = function() {
            vm.isStatus = false;
            // console.log('sdfsf1');
            for(var x = 0;x < vm.list.length;x++) {
                if (vm.list[x].approved == false) {
                    vm.list[x].approved = true;
                    vm.temp = {
                        _id: vm.list[x].id,
                        approved: vm.list[x].approved,
                        _hash: Math.getRandomHash()
                    };

                    vm.data.detail.push(vm.temp);
                } 

            }

        }

        // Select all checkbox
        this.unselectAll = function() {
            vm.isStatus = true;
            for(var x = 0;x < vm.list.length;x++)
            {
                if (vm.list[x].approved == true) {
                    // console.log('sdfsf');
                    vm.list[x].approved = false;
                    vm.temp = {
                        _id: vm.list[x].id,
                        approved: false,
                        _hash: Math.getRandomHash()
                    };
                    vm.data.detail.removeByObject(vm.temp);
                    vm.data.detail.push(vm.temp);
                    // vm.data.action = 'Action(Select All)'
                }
                
            }
        }

    };
})();