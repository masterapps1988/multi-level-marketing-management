(function() {
    'use strict';

    angular.module('app.service').service('ApiTokenService', ApiTokenService);

    function ApiTokenService($cookies) {
      // 1 day = 24(hours) * 60(minutes) * 60(seconds)
      this.expired = 24 * 60 * 60;

      this.get = function() {
        return $cookies.get('api_token_mlm');
      }

      this.set = function(apiToken) {
        var expired = new Date().getTime() + this.expired * 1000;
        
        $cookies.put('api_token_mlm', apiToken, {'expires' : new Date(expired)});
      }
    }
})();