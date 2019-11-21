(function() {

'use strict';

angular.module('app.factory').factory('StateFactory', StateFactory);

function StateFactory() {
  var State = {
      Boolean: function() {
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
      }
  };

  return State;
};

})();