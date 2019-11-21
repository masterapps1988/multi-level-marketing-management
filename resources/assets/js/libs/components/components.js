// Object list
var BoxOverlay = {
  templateUrl: path.component.boxOverlay,
  bindings: {
    isLoading: '='
  },
  controller: function() {}
};

var ButtonLoading = {
  templateUrl: path.component.buttonLoading,
  bindings: {
    name: '@', // String
    isLoading: '=' // Variable
  },
  controller: function() {}
};

var AlertMessage = {
  templateUrl: path.component.alertMessage,
  bindings: {
    message: '=', // Variable
    isShow: '=' // Variable
  },
  controller: function() {}
};

var PopUp = {
  bindings: {
    content: '=',
    modal: '=',
    data: '=',
    choose: '&'
  },
  templateUrl: path.component.popUp,
  controller: function($element, $interval) {
      var vm = this;

      this.init = function() {
          var intervalId = $interval(function() {
              console.log('component', $element.find('.modal').html());
              var _modal = vm.getModal();

              if(_modal !== undefined) {
                  vm.modal = _modal;
                  $interval.cancel(intervalId);
              }
          }, 3000);
      };

      this.onChoose = function(x) {
        this.choose({'data': x});
      };

      this.getModal = function() {
          return $element.find('.modal');
      };
  }
};

var Paging = {
  templateUrl: path.component.paging,
  bindings: {
    // Current page that would be disable(highlight)
    currentPage: '=',
    lastPage: '=',

    // Callback when paginate on click
    showPage: '&'
  },
  controller: function() {
      this.listnumber = [];

      this.init = function() {
        // this.first();
      }

      this.goTo = function(page){
        // Make sure page between MIN & MAX
        page = Math.min(this.lastPage, page);
        page = Math.max(page, 1);

        this.showPage({'page': page});
      };

      this.getListNumber = function(page) {
        var list;
        var from, to;

        // Number of page to be shown
        var n = 5;

        // Generate $from to $to
        if(page > Math.ceil(n/2)) {
          var margin = Math.floor(n/2);
          from = page - margin;
          to = page + margin;

          // When reach end
          if(to >= this.lastPage) {
            to = this.lastPage;
            from = to - n + 1;
          }
        } else {
          from = 1;
          to = n;
          to = Math.min(to, this.lastPage);
        }

        list = [];
        for(var i=from; i<=to; i++){
          list.push(i);
        }

        return list;
      };

      this.getNumber = function(page, type) {
        var from, to;

        // Number of page to be shown
        var n = 5;

        // Generate $from to $to
        if(page > Math.ceil(n/2)) {
          var margin = Math.floor(n/2);
          from = page - margin;
          to = page + margin;

          // When reach end
          if(to >= this.lastPage) {
            to = this.lastPage;
            from = to - n + 1;
          }
        } else {
          from = 1;
          to = n;
          to = Math.min(to, this.lastPage);
        }

        if(type == 'first'){
          return from;
        }
        return to;
      };

      this.previous = function(){
        this.goTo(this.currentPage-1);
      };

      this.next = function(){
        this.goTo(this.currentPage+1);
      };

      this.first = function(){
        this.goTo(1);
      };

      this.last = function(){
        this.goTo(this.lastPage);
      };
  }
};

var FlashMessage = {
  templateUrl: path.component.flashMessage,
  controller: function(FlashMessageService) {
    this.isError = function() {
      var temp = this.getMessage().is_error;
      return temp.is_error;
    };

    this.getMessage = function() {
      return FlashMessageService.getMessage();
    };

    this.isArray = function() {
      return this.getMessage() instanceof Array;
    };
  }
};

var FlashMessageStacked = {
  templateUrl: path.component.flashMessageStacked,
  controller: function(FlashMessageService) {
    this.getMessages = function() {
      var list = FlashMessageService.getMessages();

      return list;
    };

    this.removeMessage = function(x) {
      this.getMessages().removeByObject(x);
    };
  }
};

var Sortable = {
    templateUrl: path.component.sortable,
    bindings: {
      order: '='
    },
    controller: function() {
        this.getClass = function() {
            var className = '';

            switch(this.order) {
                case 'asc':
                    className = 'fa-sort-asc';
                    break;

                case 'desc':
                    className = 'fa-sort-desc';
                    break;
            }

            return className;
        };
    }
};

angular.module('app.component', []);
angular.module('app.component')
    .component('buttonLoading', ButtonLoading)
    .component('alertMessage', AlertMessage)
    .component('popUp', PopUp)
    /*
    currentPage: '=',
    numOfPage: '=',
    showPage: '&'
    <paging currentPage="num" numOfPage="num" showPage=""></paging>
    <paging current-page="vm.current_page" num-of-page="vm.num_of_page" show-page="vm.showPage(page)"></paging>
    */
    .component('paging', Paging)
    .component('flashMessage', FlashMessage)
    .component('flashMessageStacked', FlashMessageStacked)
    .component('sortable', Sortable);