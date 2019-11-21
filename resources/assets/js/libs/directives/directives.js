var BoxOverlay = function() {
  return {
    restrict: 'A',
    replace: true,
    template: '<div class="overlay" ng-if="isLoading"><i class="fa fa-refresh fa-spin"></i></div>',
    scope: {
      isLoading: '='
    },
    link: function(scope, element, attr, ctrl) {}
  }
};

var NgSelect2 = function($timeout) {
  return {
    restrict: 'A',
    scope: {
      placeholder: '@'
    },
    link: function(scope, element, attr, ctrl) {
        $timeout(function() {
            $(element).select2({
              placeholder: scope.placeholder,
              allowClear: true
            });
        }, 2000);
    }
  }
};

var NgDatetimePicker = function() {
  return {
    restrict: 'A',
    required: 'ngModel',
    scope: {
      multiple: '@',
      ngModel: '=',
      format: '@'
    },
    link: function(scope, element, attr, ctrl) {
      if(scope.multiple === undefined) {
          scope.multiple = false;
          startDate = scope.ngModel;
          if(!startDate)
            startDate = new Date;

          endDate = startDate;
      } else {
        if(scope.ngModel != null)
        {
          startDate = scope.ngModel[0];
          if(!startDate)
            startDate = new Date;

          endDate = scope.ngModel[1];
          if(!endDate)
            endDate = new Date;
        } else {
            startDate = new Date;
            endDate = new Date;
        }
      }

      if(scope.format === undefined) {
          scope.format = 'YYYY-MM-DD';
      }

      element.val(scope.ngModel);

      //Date picker
      $(element).daterangepicker({
        startDate: startDate,
        endDate: endDate,
        autoUpdateInput: false,
        locale: {
          format: scope.format
        },
        singleDatePicker: !scope.multiple,
        showDropdowns: true
      });

      $(element).on('apply.daterangepicker', function(ev, picker) {
        if(scope.multiple) {
            scope.ngModel = [];
            scope.ngModel.push(picker.startDate.format('YYYY-MM-DD'));
            scope.ngModel.push(picker.endDate.format('YYYY-MM-DD'));
        } else {
            scope.ngModel = picker.startDate.format('YYYY-MM-DD');
        }

        scope.$apply();
      });
    }
  }
};

var NgPopUp = function() {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: path.component.popUp,
    scope: {
      ngModel: '=',
      content: '=',
      data: '=',
      choose: '&',
      popUpService: '=' // Pop service to handle all super customize action
    },
    link: function(scope, element, attr, ctrl) {
        scope.ngModel = element;
        scope.onChoose = function(x) {
            scope.choose({'data': x});
        };
    }
  }
};

var NgConfirmClick = function() {
  return {
    link: function (scope, element, attr) {
      var msg = attr.ngConfirmClick || "Are you sure?";
      var clickAction = attr.confirmedClick;
      element.bind('click',function (event) {
        if ( window.confirm(msg) ) {
          scope.$eval(clickAction)
        }
      });
    }
  };
};

var NgScrollTo = function($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attr) {
        $timeout(function() {
            element.on('click', function() {
              var $dom = $(element.attr('ng-scroll-to'));
              if ($dom.length > 0 && !$dom.hasClass('ng-hide')) {
                  $('html, body').animate({
                      scrollTop: $dom.offset().top
                  }, 500);
              }
            });
        }, 10);
    }
  };
};

/*
 * ng-model: store all binary files
 * ng-file: callback when user choose files from browser windows
 *
 * <input type="file" id="ad-picture" class="hide" ng-model="ad.adPictureFiles"
 * ng-file="ad.uploadAdPictures()" multiple>
 */
var NgFile = function() {
  return {
    restrict: 'A',
    require: 'ngModel',
    scope: {
      ngModel: '=',
      ngFile: '&'
    },
    link: function(scope, element, attr, ngModel) {
        element.bind('change', function (changeEvent) {
            var node = changeEvent.target.cloneNode();
            var files = node.files[0];
            if(attr.multiple) {
                files = node.files;
            }

            ngModel.$setViewValue(files);
            ngModel.$render();

            // Reset input
            // changeEvent.target.value = null;

            // Callback
            scope.ngFile();
        });
    }
  }
};

angular.module('app.directive')
.directive('boxOverlay', BoxOverlay)
.directive('ngSelect2', NgSelect2)
.directive('ngDatetimePicker', NgDatetimePicker)
.directive('ngPopUp', NgPopUp)
.directive('ngConfirmClick', NgConfirmClick)
.directive('ngScrollTo', NgScrollTo)
.directive('ngFile', NgFile);