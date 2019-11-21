(function() {

'use strict';

angular.module('app').controller('MainController', MainController);
function MainController($http, $interval, ApiService, AuthService, FlashMessageService,
AccessControlService, BalanceService, $scope, $state) {
  $scope.$state = $state;
  
  var vm = this;

  this.loaded = false;
  this.viewLoadedList = [];
  this.messages = [];
  this.ac = AccessControlService;
  this.bl = BalanceService;

  this.user = AuthService;
  this.fm = FlashMessageService;

  this.init = function() {
    // Run interval
    this.fm.start();

    ApiService.Account.Profile.get().then(function(resp) {
        var data = resp.data;
        vm.user = data.data;
        
        AccessControlService.setUser(vm.user);
    });

    ApiService.Account.Balance.get().then(function(resp) {
      var data = resp.data;
      vm.balance = data.data;
      if(!vm.balance){
        vm.balance = {};
      }
      
      vm.balance.balance = data.data ? data.data.balance : 0;
      
      
      BalanceService.setBalance(vm.balance);
    });

    setInterval(function() {
      $('body').layout('fix');
      $('body').layout('fixSidebar');
      // $.AdminLTE.layout.activate();
    }, 3000);

    var _closure = null;
    for(var i=0; i<viewList.length; i++) {
        this.viewLoadedList[i] = false;
        _closure = function(index) {
            $http.get(viewList[index]).then(function(data) {
                vm.viewLoadedList[index] = true;
                // console.log('get ' + index);
            });
        };

        _closure(i);
    };

    var id = $interval(function(){
        if(vm.isLoaded()) {
            vm.loaded = true;
            
            $interval.cancel(id);
        }
    }, 500);
  };

  this.removeMessage = function(x) {
      this.messages.removeByObject(x);
  }

  this.isLoaded = function() {
    var count = 0;
    var x = 0;

    for(var i=0; i<this.viewLoadedList.length; i++) {
        x = this.viewLoadedList[i];
        if(x == true)
            count++;
    };

    return count >= viewList.length;
  }

  this.logout = function() {
      ApiService.Auth.logout().then(function(resp) {
        window.location = '/logout';
      });
  };
};

})();
