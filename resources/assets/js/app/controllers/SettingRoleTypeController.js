(function() {
    'use strict';
    
    angular.module('app').controller('SettingRoleTypeController', SettingRoleTypeController);
    
    function SettingRoleTypeController($state, $stateParams, ApiService, LoadingService,
    FlashMessageService, AccessControlService) {
        var vm = this;
    
        this.search = {};
        this.message = null;
        this.orderBy = new OrderBy();
    
        // Paginator
        this.paginator = {};
        this.list = [];
        this.data = {};
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
            return {
                role_id: null,
                detail: [],
                _delete: [],
                _hash: Math.getRandomHash(),
            };
        };
    
        this.init = function() {
            console.log('Role list init');
            this.createEmptyData();
            this.selectedHash = null;
            var search = {};
            vm.search = search;
           
            vm._doSearch();
        };
    
        // Search Role
        this._doSearch = function() {
            vm.ls.get('loading').on();
            this.search.group_by = 'role';
            console.log('do search', this.search);
            ApiService.Setting.RoleType.all(this.search).then(function(resp){
                var data = resp.data;
                vm.list = data.data;
    
                vm.ls.get('loading').off();
            });
        };

        //Show Role
        this.create = function() 
        {
            vm.ls.get('loading').on();
            console.log('create',vm.data);
            var roleId = $stateParams.id;
            if(roleId){
                ApiService.Setting.RoleType.get(roleId).then(function(resp){
                    if(!resp.data.is_error) {
                        var data = resp.data;
                        vm.data = data.data;
                        vm.ls.get('loading').off();
                    } else {
                        vm.fm.error(resp.data.message);
                        console.log('errors', resp.data.errors);
                        vm.ls.get('loading').off();
                    }
        
                    vm.ls.get('loading').off();
                });
            }
            vm.ls.get('loading').off();
        }

        //set permission
        this.getPermission = function() {
            vm.ls.get('loading').on();
            var roleId = $stateParams.role_id;
            if(roleId){
                ApiService.Setting.RoleType.getPermisson(roleId).then(function(resp){
                    if(!resp.data.is_error) {
                        var data = resp.data;
                        data.data.role_id = roleId;
                        vm.data = data.data;
                        vm.isStatus = vm.isSelectedAll();

                        vm.data._delete_detail = [];
                        vm.data.detail = [];
                        vm.ls.get('loading').off();
                    } else {
                        vm.fm.error(resp.data.message);
                        console.log('errors', resp.data.errors);
                        vm.ls.get('loading').off();
                    }
        
                    vm.ls.get('loading').off();
                });
            }
            vm.ls.get('loading').off();
        };

        // Submit to DB Set Permission
        this.submit = function() {
            vm.ls.get('loading').on();
            var postData = this._createPostData(this.data);
            
            ApiService.Setting.RoleType.setPermission(postData).then(function(resp){
                if(!resp.data.is_error) {
                    vm.getPermission();

                    if($stateParams.role_id == AccessControlService.getUser().role_id) {
                        AccessControlService.refresh();
                    }

                    vm.fm.success(resp.data.message);
                } else {
                    vm.fm.error(resp.data.message);
                    console.log('errors', resp.data.errors);
                }
    
                vm.ls.get('loading').off();
            });
    
        };

        // Submit to DB Role
        this.submitRole = function() {
            vm.ls.get('loading').on();
            console.log('submit role', this.data);
            var postData = this._createPostDataRole(this.data);
            
            ApiService.Setting.RoleType.create(postData).then(function(resp){
                if(!resp.data.is_error) {
                    vm.fm.success(resp.data.message);
                    $state.go('role-detail');
                } else {
                    vm.fm.error(resp.data.message);
                    console.log('errors', resp.data.errors);
                }
    
                vm.ls.get('loading').off();
            });
    
        };

        this._createPostDataRole = function(data){
            console.log('_createPostDataRole',data);
            var postData = {
                id: data.id,
                name: data.name,
                label: data.label,
                notes: data.notes
            };
    
            return postData;
        };
    
        // Add blank role
        this.add = function(x) {
            this.temp = {
                _id: x.id,
                is_checked: x.is_checked,
                _hash: Math.getRandomHash()
            };
            
            this.data.detail.push(this.temp);
        };

        this._createPostData = function(data){
            var postData = {
                role_id: data.role_id,
                detail: data.detail
            };
            for(var i=0; i<postData.detail.length; i++) {
                delete postData.detail[i]._hash;
                delete postData.detail[i].is_edit;
                delete postData.detail[i].$$hashKey;
            }
            
            return postData;
        };

        // Redirect to list set permission
        this.loadSetPermission = function() {
            vm.ls.get('loading').on();
            var roleId = $stateParams.role_id;
            ApiService.Setting.RoleType.getPermisson(roleId).then(function(resp) {
                var data = resp.data;
                data.data.role_id = roleId;
                vm.data = data.data
                vm.data._delete_detail = [];
                vm.data.detail = [];
                // Paginator
                vm.paginator = Paginator(data);
    
                vm.ls.get('loading').off();
            });
        }

        // if detail is selected all
        this.isSelectedAll = function() {
            var isSelectedAll = true;
            for(var x = 0;x < vm.data.details.length;x++) {
                if (vm.data.details[x].is_checked != false) {
                    isSelectedAll = false;
                    break;
                }
            }
            
            return isSelectedAll;
        };

        // Select all checkbox
        this.selectAll = function() {
            vm.isStatus = false;
            for(var x = 0;x < vm.data.details.length;x++) {
                if (vm.data.details[x].is_checked == false) {
                    vm.data.details[x].is_checked = true;
                    vm.temp = {
                        _id: vm.data.details[x].id,
                        is_checked: vm.data.details[x].is_checked,
                        _hash: Math.getRandomHash()
                    };
                    
                    vm.data.detail.push(vm.temp);
                } 
            }
        }

        // Select all checkbox
        this.unselectAll = function() {
            vm.isStatus = true;
            for(var x = 0;x < vm.data.details.length;x++)
            {
                if (vm.data.details[x].is_checked == true) {
                    vm.data.details[x].is_checked = false;
                    vm.temp = {
                        _id: vm.data.details[x].id,
                        is_checked: false,
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