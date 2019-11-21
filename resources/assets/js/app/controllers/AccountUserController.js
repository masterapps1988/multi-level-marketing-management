(function() {
    'use strict';
    
    angular.module('app').controller('AccountUserController', AccountUserController);
    
    function AccountUserController($state, $stateParams, ApiService, LoadingService,
    FlashMessageService, AccessControlService) {
        var vm = this;

        this.permissions = {
            admin: ['account_user_create', 'account_user_delete', 'account_user_detail',
                'account_user_list']
        };
    
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
        this.exceptRoles = 'admin';
    
        this.createEmptyData = function() {
            this.data = {
                full_name: null,
                username: null,
                user_id_parent: null,
                password: null,
                gender: null,
                address: null,
                email: null,
                role_type: 'admin',
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
            this.titleRole = "List User";
        };
        
        this.init = function() {
            this.createEmptyData();
            this.setTitle();
            var search = {};
    
            // If role is NOT empty then this mean is NOT admin
            if($stateParams.role){
                search.roles = $stateParams.role; // Get only 1 role from $role variable
                this.data.role = $stateParams.role;
            } else {
                // Get all admin
                search.except_roles = this.exceptRoles;
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

            // Get correct permission from string based on role
    this.getPermission = function(permission) {
        var permissionTable = this.permissions.admin;
        
        var newPermission = null;
        switch(permission) {
            case 'create':
                newPermission = permissionTable[0];
                break;
            case 'delete':
                newPermission = permissionTable[1];
                break;
            case 'detail':
                newPermission = permissionTable[2];
                break;
            case 'list':
                newPermission = permissionTable[3];
                break;
        }

        return newPermission;
    }
    
        // Search User
        this._doSearch = function() {
            vm.ls.get('loading').on();
            ApiService.Account.User.all(vm.search).then(function(resp) {
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
                $state.go('account-profile', {state: 'account-profile'});
            });
        };
    
        this.create = function() {
            this.createEmptyData();
            this.genders();

            var id = $stateParams.id;
            
            if(id) {
                vm.ls.get('loading').on();
                ApiService.Account.User.get(id).then(function(resp) {
                    if(!resp.data.is_error) {
                        var data = resp.data.data;
                        if (data.role_type) {
                            data.role_type = String(data.role_type);
                        }
                        if (data.role_id) {
                            data.role_id = String(data.role_id);
                        }
                        if (data.gender) {
                            data.gender = String(data.gender);
                        }
    
                        vm.data = data;
                        vm.password_current = vm.data.password;
                    } else {
                        vm.message = resp.data.errors;
                        
                        $state.go('account-user');  
                    }
                    
                    vm.ls.get('loading').off();
                });
            }

            ApiService.RoleType.all({page: 'all'}).then(function(resp) {
                var data = resp.data;
                
                vm.roletypes = data.data;
                vm.roletypes.id = String(vm.roletypes.id);
            });
        };

        this.genders = function(){
            var genders = [
                {id: "1", name: "Male"},
                {id: "2", name: "Female"}
            ]
            vm.genders = genders;
            vm.genders.id = String(vm.genders.id);
            
        }

        this.showPage = function(page) {
            this.search.page = page;
            this.doSearch();
        };
    
        // Redirect to correct route
        this.doSearch = function() {
            console.log('search', this.search);
            this.search.order_by = this.orderBy.toString();
           
            $state.go('account-user', this.search);  
            
        };
    
        // Submit to DB
        this.submit = function(){
            vm.ls.get('loading').on();
            var postData = this._createPostData(this.data);
            
            ApiService.Account.User.create(postData).then(function(resp){
                if(!resp.data.is_error) {
                    if($stateParams.id)
                        $state.go('account-user');
    
                    vm.fm.success(resp.data.message);
                } else {
                    vm.fm.error(resp.data.message);
                }
                
                vm.ls.get('loading').off();
            }).catch(function (error){
                vm.fm.error(error.data.errors[0]);
                // vm.message = error.data.errors;
                $state.go('account-profile', {state: 'account-profile'});
                vm.ls.get('loading').off();
            });
        };
    
        this._createPostData = function(data){
            var postData = {
                id: data._id,
                role_type: data.role_type,
                username: data.username,
                password: data.password,
                current_password: vm.password_current,
                email: data.email,
                full_name: data.full_name,
                address: data.address,
                phone: data.phone
            };
    
            return postData;
        };
    
        this.delete = function(id) {
            vm.ls.get('loading').on();
            ApiService.Account.User.delete(id).then(function(resp) {
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
    
        this.isOperator = function() {
            return this.isRole('operator');
        };
    
        this.isAdmin = function() {
            return this.isRole('admin');
        };
    
        this.isRole = function(role) {
            return this.data.role_type === role;
        };
    };
    })();