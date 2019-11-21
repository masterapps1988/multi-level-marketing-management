/* This class used by Loading component. All boolean based on key loaded from this class
 */
(function() {
    'use strict';

    angular.module('app.service').service('LoadingService', LoadingService);

    function LoadingService() {
      var vm = this;

      this.list = [];
      
      // Anonymous object
      this._boolean = function() {
        this.boolean = false;

        this.on = function() {
          this.boolean = true;
        };

        this.off = function() {
          this.boolean = false;
        };

        this.get = function() {
          return this.boolean;
        };
      };

      this.get = function(key) {
        var bol = this.list[key];
        if(!bol) {
          this.list[key] = new this._boolean();
          bol = this.list[key];
        }

        return bol;
      }
    }
})();