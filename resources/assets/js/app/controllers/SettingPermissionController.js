(function() {
    'use strict';
    
    angular.module('app').controller('SettingPermissionController', SettingPermissionController);
    
    function SettingPermissionController($state, $stateParams, ApiService, LoadingService,
    FlashMessageService, AccessControlService) {
        var vm = this;
    
        this.ac = AccessControlService;
    
        this.search = {};
        this.message = null;
        this.orderBy = new OrderBy();
    
        // Paginator
        this.paginator = {};
    
        this.fm = FlashMessageService;
        this.ls = LoadingService;
    
        this.list = null;
    
        this.createEmptyData = function() {
            this.data = {
                label: null,
                name: null,
                notes: null
            };
        };
        
        this.init = function() {
            this.createEmptyData();
            var search = {};
    
            if($stateParams.created)
                search.created = $stateParams.created;
            if($stateParams.page)
                search.page = $stateParams.page;
    
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

        this.getPermission = function(name) {
            var list = [];
            
            switch(name) {
                case 'detail':
                    list = ['setting_permission_detail', 'setting_permission_delete'];
                    
                    break;
            }
            
            return list;
        };

        // Search Level
        this._doSearch = function() {
            vm.ls.get('loading').on();
            
            ApiService.Setting.Permission.all(vm.search).then(function(resp) {
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
                $state.go('dashboard');
            });
        };
    
        // Redirect to correct route
        this.doSearch = function() {
            this.search.order_by = this.orderBy.toString();
        };
    
        this.create = function() {
            this.createEmptyData();

            var id = $stateParams.id;
            
            if(id) {
                vm.ls.get('loading').on();
                ApiService.Setting.Permission.get(id).then(function(resp) {
                    if(!resp.data.is_error) {
                        var data = resp.data.data;
                        vm.data = data;
                    } else {
                        vm.message = resp.data.errors;
                        $state.go('setting-permission');
                    }
                    
                    vm.ls.get('loading').off();
                }).catch(function (error){
                    vm.fm.error(error.data.errors[0]);
                    $state.go('setting-permission', {state: 'account-profile'});
                });
            }
        };

        this.showPage = function(page) {
            this.search.page = page;
            this.doSearch();
        };
    
        // Redirect to correct route
        this.doSearch = function() {
            this.search.order_by = this.orderBy.toString();
            
            $state.go('setting-permission', this.search);
        };
    
        // Submit to DB
        this.submit = function(){
            vm.ls.get('loading').on();
            var postData = this._createPostData(this.data);
            
            ApiService.Setting.Permission.create(postData).then(function(resp){
                if(!resp.data.is_error) {
                    vm.fm.success(resp.data.message);
                    $state.go('setting-permission');
                } else {
                    vm.fm.error(resp.data.message);
                }
                
                vm.ls.get('loading').off();
            });
    
        };
    
        this._createPostData = function(data){
            var postData = {
                id: data._id,
                label: data.label,
                name: data.name,
                notes: data.notes
            };

            for(var i=0; i<postData.length; i++) {
                delete postData[i]._hash;
                delete postData[i].is_edit;
                delete postData[i].$$hashKey;
            }
    
            return postData;
        };
    
        this.delete = function(id) {
            vm.ls.get('loading').on();
            ApiService.Admin.delete(id).then(function(resp) {
                if(!resp.data.is_error) {
                    vm._doSearch();
                    vm.fm.success(resp.data.message);
                } else {
                    vm.fm.error(resp.data.message);
                    console.log('errors', resp.data.errors);
                }
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