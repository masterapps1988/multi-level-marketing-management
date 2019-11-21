(function() {

'use strict';

angular.module('app.service').service('ApiService', ApiService);

function ApiService(
  $http, $httpParamSerializer, ApiTokenService) {
  var apiToken = ApiTokenService.get();

  this.Dashboard = {};

  this.Profit = {
    Hierarchy: {
      get: function(params) {
        params.api_token = apiToken;
        var url = '/api/profit/hierarchy?' + $.param(params);
        
        return $http.get(url);
      }
    },
    DownlineEarning: {
      all: function(params) {
        params.api_token = apiToken;
        var url = '/api/profit/downline-earning?' + $.param(params);
        
        return $http.get(url);
      },
      count: function() {
        var url = '/api/profit/count-downline-earning?api_token=' + apiToken;
        
        return $http.get(url);
      }
    }
  }

  this.RoleType = {
    all: function(params) {
      params.api_token = apiToken;
      var url = '/api/role-type?' + $.param(params);

      return $http.get(url);
    }
  }
  
  this.Account = {
    User: {
      all: function(params) {
        params.api_token = apiToken;
        var url = '/api/account/user/list?' + $.param(params);
  
        return $http.get(url);
      },
      get:  function(id) {
        var url = '/api/account/user/detail/'+ id +'?api_token=' + apiToken;
        
        return $http.get(url);
      },
      delete: function(id) {
        var url = '/api/account/user/delete/' + id + '?api_token=' + apiToken;
  
        return $http.delete(url);
      },
      create: function(post) {
        var params = post;
        params.api_token = apiToken;
        var url = '/api/account/user/create';
        return $http({
            method: 'POST',
            url:url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param(params)
        });
      }
    },
    Balance: {
      get: function() {
        var url = '/api/balance?api_token=' + apiToken;
        
        return $http.get(url);
      },
    },
    Profile: {
      get: function() {
        var url = '/api/profile?api_token=' + apiToken;
        
        return $http.get(url);
      },
      update: function(put) {
        var params = put;
          params.api_token = apiToken;
          var url = '/api/profile/update';
          return $http({
              method: 'PUT',
              url:url,
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              data: $.param(params)
          });
      }
    },
    Status: {
      all: function(params) {
        params.api_token = apiToken;
        var url = '/api/account/status/list?' + $.param(params);
  
        return $http.get(url);
      },
      count: function() {
        var url = '/api/account/status/count?api_token=' + apiToken;
  
        return $http.get(url);
      },
      approved: function(put) {
        var params = put;
        params.api_token = apiToken;
        var url = '/api/account/status/approved';
        return $http({
            method: 'PUT',
            url:url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param(params)
        });
      }
    },
    Mpin: {
      all: function(params) {
        params.api_token = apiToken;
        var url = '/api/account/mpin/list?' + $.param(params);
  
        return $http.get(url);
      },
      count: function() {
        var url = '/api/account/mpin/count?api_token=' + apiToken;
  
        return $http.get(url);
      },
      count_per_month: function(params) {
        params.api_token = apiToken;

        var url = '/api/account/mpin/count-per-month?' + $.param(params);
  
        return $http.get(url);
      },
      count_utilization_per_month: function(params) {
        params.api_token = apiToken;

        var url = '/api/account/mpin/count-utilization-per-month?' + $.param(params);
  
        return $http.get(url);
      },
      gen: function(post) {
        var params = post;
        params.api_token = apiToken;
        var url = '/api/account/mpin/create';
        return $http({
            method: 'POST',
            url:url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param(params)
        });
      }
    }
  };

  this.Setting = {
    Level: {
      all: function(params) {
        params.api_token = apiToken;
        var url = '/api/setting/level/list?' + $.param(params);
  
        return $http.get(url);
      },
      get:  function(id) {
        var url = '/api/setting/level/detail/' + id +'?api_token=' + apiToken;
        
        return $http.get(url);
      },
      create: function(post) {
        var params = post;
        params.api_token = apiToken;
        var url = '/api/setting/level/create';
        return $http({
            method: 'POST',
            url:url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param(params)
        });
      }
    },
    Permission: {
      all: function(params) {
        params.api_token = apiToken;
        var url = '/api/setting/permission/list?' + $.param(params);
  
        return $http.get(url);
      },
      get:  function(id) {
        var url = '/api/setting/permission/detail/' + id + 'api_token='+ apiToken;
        
        return $http.get(url);
      },
      create: function(post) {
        var params = post;
        params.api_token = apiToken;
        var url = '/api/setting/permission/create';
        return $http({
            method: 'POST',
            url:url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param(params)
        });
      }
    },
    RoleType: {
      all: function(params) {
        params.api_token = apiToken;
        var url = '/api/setting/role-type/list?' + $.param(params);
  
        return $http.get(url);
      },
      get:  function(id) {
        var url = '/api/setting/role-type/detail/' + id + 'api_token='+ apiToken;
        
        return $http.get(url);
      },
      getPermisson: function(id) {
        var url = '/api/setting/role-type/' + id + '/permission?api_token=' + apiToken;
  
        return $http.get(url);
      },
      create: function(params) {
        params.api_token = apiToken;

        var url = '/api/setting/role-type/create';
  
        return $http({
            method: 'POST',
            url:url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param(params)
        });
      },
      setPermission: function(params) {
        params.api_token = apiToken;
  
        var url = '/api/setting/role-type/set-permission';
  
        return $http({
            method: 'POST',
            url:url,
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: $.param(params)
        });
      },
    }
  };

  this.Customer = {
    all: function(params) {
      params.api_token = apiToken;
      var url = '/api/account/customer/list?' + $.param(params);

      return $http.get(url);
    },
    count: function() {
      var url = '/api/account/customer/count?api_token=' + apiToken;

      return $http.get(url);
    },
  }
  

};

})();
