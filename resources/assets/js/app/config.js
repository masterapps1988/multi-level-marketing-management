(function() {

'use strict';

angular.module('app').config(config);

function config($stateProvider, $urlRouterProvider, $httpProvider) {
    console.log('path', path);

    var states = [];
    var state = null;

    state = {
        name: 'dashboard',
        url: '/dashboard',
        templateUrl: path.dashboard,
        controller: 'DashboardController',
        controllerAs: 'vm'
    };
    states.push(state);

    state = {
        name: 'profit-hierarchy',
        url: '/profit/hierarchy?keyword',
        templateUrl: path.profit.hierarchy.index,
        controller: 'ProfitHierarchyController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null }
        }
    };
    states.push(state);

    state = {
        name: 'profit-downline-earning',
        url: '/profit/downline-earning?keyword&order_by&page',
        templateUrl: path.profit.downline.index,
        controller: 'ProfitDownlineEarningController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null },
            order_by: { squash: true, value: null },
            page: { squash: true, value: null }
        }
    };
    states.push(state);

    state = {
        name: 'account-profile',
        url: '/account/user/profile',
        templateUrl: path.account.profile.update,
        controller: 'AccountProfileController',
        controllerAs: 'vm',
        params: {
           state: { squash: true, value: null }
        }
    };
    states.push(state);

    state = {
        name: 'account-user',
        url: '/account/user/list?keyword&order_by&page',
        templateUrl: path.account.user.index,
        controller: 'AccountUserController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null },
            order_by: { squash: true, value: null },
            page: { squash: true, value: null }
        }
    };

    states.push(state);

    state = {
        name: 'account-user-create',
        url: '/account/user/create',
        templateUrl: path.account.user.create,
        controller: 'AccountUserController',
        controllerAs: 'vm'
    };

    states.push(state);

    state = {
        name: 'account-user-detail',
        url: '/account/user/detail/{id}',
        templateUrl: path.account.user.create
    };

    states.push(state);

    state = {
        name: 'account-status',
        url: '/account/status/list?keyword&order_by&page',
        templateUrl: path.account.status.index,
        controller: 'AccountStatusController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null },
            order_by: { squash: true, value: null },
            page: { squash: true, value: null }
        }
    };

    states.push(state);

    state = {
        name: 'setting-level',
        url: '/setting/level/list?keyword&order_by&page',
        templateUrl: path.setting.level.index,
        controller: 'SettingLevelController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null },
            order_by: { squash: true, value: null },
            page: { squash: true, value: null }
        }
    };
    states.push(state);

    state = {
        name: 'setting-level-create',
        url: '/setting/level/create',
        templateUrl: path.setting.level.create,
        controller: 'SettingLevelController',
        controllerAs: 'vm'
    };

    states.push(state);

    state = {
        name: 'setting-level-detail',
        url: '/setting/level/detail/{id}',
        templateUrl: path.setting.level.create
    };

    states.push(state);

    state = {
        name: 'setting-permission',
        url: '/setting/permission/list?keyword&order_by&page',
        templateUrl: path.setting.permission.index,
        controller: 'SettingPermissionController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null },
            order_by: { squash: true, value: null },
            page: { squash: true, value: null }
        }
    };
    states.push(state);

    state = {
        name: 'setting-permission-create',
        url: '/setting/permission/create',
        templateUrl: path.setting.permission.create,
        controller: 'SettingLevelController',
        controllerAs: 'vm'
    };

    states.push(state);

    state = {
        name: 'setting-permission-detail',
        url: '/setting/permission/detail/{id}',
        templateUrl: path.setting.permission.create
    };

    states.push(state);

    state = {
        name: 'setting-roletype',
        url: '/setting/role-type/list?keyword&order_by&page',
        templateUrl: path.setting.roletype.index,
        controller: 'SettingRoleTypeController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null },
            order_by: { squash: true, value: null },
            page: { squash: true, value: null }
        }
    };
    states.push(state);

    state = {
        name: 'setting-roletype-set-permission',
        url: '/setting/role-type/set-permission/{role_id}',
        templateUrl: path.setting.roletype.setPermission,
        controller: 'SettingRoleTypeController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null },
            order_by: { squash: true, value: null },
            page: { squash: true, value: null }
        }
    };
    states.push(state);

    state = {
        name: 'setting-roletype-create',
        url: '/setting/role-type/create',
        templateUrl: path.setting.roletype.create,
        controller: 'SettingRoleTypeController',
        controllerAs: 'vm'
    };

    states.push(state);

    state = {
        name: 'setting-roletype-detail',
        url: '/setting/role-type/detail/{id}',
        templateUrl: path.setting.roletype.create
    };

    states.push(state);

    state = {
        name: 'account-customer',
        url: '/account/customer/list?keyword&order_by&page',
        templateUrl: path.account.customer.index,
        controller: 'AccountCustomerController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null },
            order_by: { squash: true, value: null },
            page: { squash: true, value: null }
        }
    };

    states.push(state);

    state = {
        name: 'account-mpin',
        url: '/account/mpin/list?keyword&order_by&page',
        templateUrl: path.account.mpin.index,
        controller: 'AccountMpinController',
        controllerAs: 'vm',
        params: {
            keyword: { squash: true, value: null },
            order_by: { squash: true, value: null },
            page: { squash: true, value: null }
        }
    };

    states.push(state);

    for(var i=0; i<states.length; i++)
        $stateProvider.state(states[i]);

    $urlRouterProvider.otherwise('/dashboard');
    // alternatively, register the interceptor via an anonymous factory
    $httpProvider.interceptors.push(function($q) {
      return {
        'response': function(resp) {
            var data = resp.data;

            if(data.status === 401) {
                // Force logout
                window.location = '/logout';
            }

            return resp;
        }
      };
    });
}

})();
