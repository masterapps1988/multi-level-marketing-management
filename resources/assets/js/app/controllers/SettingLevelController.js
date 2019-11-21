(function() {
    'use strict';
    
    angular.module('app').controller('SettingLevelController', SettingLevelController);
    
    function SettingLevelController($state, $stateParams, ApiService, LoadingService,
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
                code: null,
                name: null,
                level: null
            };
        };
        
        this.init = function() {
            this.createEmptyData();
            var search = {};
    
            if($stateParams.created)
                search.created = $stateParams.created;
    
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
                    list = ['setting_level_detail', 'setting_level_delete'];
                    
                    break;
            }
            
            return list;
        };

        // Search Level
        this._doSearch = function() {
            vm.ls.get('loading').on();
            
            ApiService.Setting.Level.all(vm.search).then(function(resp) {
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
                ApiService.Setting.Level.get(id).then(function(resp) {
                    if(!resp.data.is_error) {
                        var data = resp.data.data;
                        vm.data = data;
                    } else {
                        vm.message = resp.data.errors;
                        $state.go('setting-level');
                    }
                    
                    vm.ls.get('loading').off();
                }).catch(function (error){
                    vm.fm.error(error.data.errors[0]);
                    $state.go('setting-level', {state: 'account-profile'});
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
            
            $state.go('setting-level', this.search);
        };
    
        // Submit to DB
        this.submit = function(){
            vm.ls.get('loading').on();
            var postData = this._createPostData(this.data);
            
            ApiService.Setting.Level.create(postData).then(function(resp){
                if(!resp.data.is_error) {
                    vm.fm.success(resp.data.message);
                    $state.go('setting-level');
                } else {
                    vm.fm.error(resp.data.message);
                }
                
                vm.ls.get('loading').off();
            });
    
        };
    
        this._createPostData = function(data){
            var postData = {
                id: data._id,
                code: data.code,
                name: data.name,
                level: data.level
            };
    
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