(function() {
    'use strict';
    
    angular.module('app').controller('AccountProfileController', AccountProfileController);
    
    function AccountProfileController($state, $stateParams, ApiService, LoadingService,
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
        this.exceptRoles = 'admin';
    
        this.createEmptyData = function() {
            this.data = {
                full_name: null,
                password: null,
                gender: null,
                address: null,
                email: null,
                phone: null,
                updated_at: null,
                updated_by: null,
            };
        };

        this.create = function() {
            this.createEmptyData();
            this.genders();

            if ($stateParams.state) {
                vm.ls.get('loading').on();
                ApiService.Account.Profile.get().then(function(resp) {
                    if(!resp.data.is_error) {
                        
                        var data = resp.data.data;
                        data.gender = String(data.gender);
    
                        vm.data = data;
                        vm.password_current = vm.data.password;
                    } else {
                        vm.message = resp.data.errors;
                        if ($stateParams.role) {
                            $state.go('user-role');
                        } else {
                            $state.go('account-user');  
                        }
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

        // Submit to DB
        this.submit = function(){
            vm.ls.get('loading').on();
            var postData = this._createPostData(this.data);
            
            ApiService.Account.Profile.update(postData).then(function(resp){
                if(!resp.data.is_error) {
                    $state.go('account-profile');
    
                    vm.fm.success(resp.data.message);
                } else {
                    vm.fm.error(resp.data.message);
                }
                
                vm.ls.get('loading').off();
            }).catch(function(error) {
                vm.fm.error(error.data.errors[0]);
                
                $state.go('account-profile', {state: 'account-profile'});
                vm.ls.get('loading').off();
            });
        };
    
        this._createPostData = function(data){
            var postData = {
                id: data._id,
                gender: data.gender,
                password: data.password ,
                current_password: vm.password_current,
                email: data.email,
                full_name: data.full_name,
                address: data.address,
                phone: data.phone
            };
    
            return postData;
        };
    };
    })();