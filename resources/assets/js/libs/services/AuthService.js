(function() {
    'use strict';

    angular.module('app.service').service('AuthService', AuthService);

    function AuthService(ApiService) {
      var vm = this;

      this.user = {};

      this.init = function() {
          ApiService.Account.Profile.get().then(function(resp) {
              var data = resp.data;

              vm.user = data.data;
          });
      };

      this.isAdmin = function() {
          return this.getRole() === 'super-admin';
      };

      this.isStaff = function() {
          return this.getRole() === 'staff';
      };

      this.getRole = function() {
          var role = null;

          if(this.user.hasOwnProperty('role'))
              role = this.user.role;

          return role;
      };
    }
})();