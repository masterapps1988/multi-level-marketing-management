(function() {

    'use strict';
    
    angular.module('app.service').service('BalanceService', BalanceService);
    
    function BalanceService(ApiService) {
        var vm = this;
        
        this.Balance = {};

        this.refresh = function() {
            ApiService.Account.Balance.get().then(function(resp) {
                var data = resp.data;
                vm.balance = data.data;

                if(!vm.balance){
                    vm.balance = {};
                }
                  
                vm.balance.balance = data.data ? data.data.balance : 0;
                vm.setBalance(vm.balance)
            });
        };
    
        this.getBalance = function() {
            
            return this.Balance;
        };
    
        this.setBalance = function(balance) {
            this.Balance = balance;
        };
    };
})();