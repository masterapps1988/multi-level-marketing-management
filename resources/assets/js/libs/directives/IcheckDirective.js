angular.module('app.directive').directive('ngIcheck', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attr, ctrl) {
        $(element).iCheck({
          checkboxClass: 'icheckbox_square-blue',
          radioClass: 'iradio_square-blue',
          increaseArea: '20%' // optional
        });
    }
  };
});