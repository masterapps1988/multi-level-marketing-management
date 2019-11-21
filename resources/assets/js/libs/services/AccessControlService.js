(function() {

'use strict';

angular.module('app.service').service('AccessControlService', AccessControlService);

function AccessControlService(ApiService) {
  var vm = this;

  this.User = {};

  this.refresh = function() {
    ApiService.Account.Profile.get().then(function(resp) {
            var data = resp.data;
            vm.user = data.data;
        });
    };

    this.getRoleTypeName = function() {
        return this.User.role_type_name;
    };

    this.getUser = function() {
        return this.User;
    };

    this.setUser = function(user) {
        this.User = user;
    };

    this.hasAccess = function(name) {
        var temp = false;
        var permission = this.User.permission;
        
        if(Array.isArray(permission))
            for(var i=0; i<permission.length; i++) {
                if(permission[i] === name) {
                    
                    temp = true;
                    break;
                }
            }

        return temp;
    };

  // Check if has accesses one of them
  this.hasAccesses = function(list) {
      var temp = false;
      for(var i = 0; i<list.length; i++) {
          if(this.hasAccess(list[i])) {
              temp = true;
              break;
          }
      }

      return temp;
  };

  this.mustHasAccesses = function(list) {
      var temp = true;
      for(var i = 0; i<list.length; i++) {
          if(!this.hasAccess(list[i])) {
              temp = false;
              break;
          }
      }

      return temp;
  };
};

})();