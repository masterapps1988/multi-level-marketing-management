(function() {

'use strict';

angular.module('app.service').service('DateTimeService', DateTimeService);

function DateTimeService() {
  this.getDate = function(date) {
      return moment(date).format('YYYY-MM-DD');
  };
};

})();