(function() {
    'use strict';

    angular.module('app.service').service('FlashMessageService', FlashMessageService);

    function FlashMessageService($interval) {
      var vm = this;

      this.messages = [];
      this._isError;
      this.timerId = null;
      this.counter = 0;
      this.duration = 5 * 1000;

      // Get last message
      this.getMessage = function() {
        var temp = null;
        if(this.messages.length > 0)
            temp = this.messages[this.messages.length - 1];

        // Return last message
        return temp;
      };

      this.getMessages = function() {
        return this.messages;
      };

      /* Set message
       *
       * @param String m
       */
      this.setMessage = function(m, isError) {
        var temp = {
            message: m,
            is_error: isError,
            date: new Date()
        };

        this.messages.push(temp);
      };

      this.start = function() {
        this.startTimer();
      };

      this.startTimer = function() {
        $interval(function() {
            var date = new Date();
            var duration = vm.duration; // ms
            for(var i=0; i<vm.messages.length; i++) {
                var x = vm.messages[i];
                console.log(x.date, date);
                if(x.date.getTime() + duration < date.getTime()) {
                    // Remove the element
                    vm.messages.removeByObject(x);
                    console.log('remove object');
                }
            }
        }, 1000);
      }

      this.success = function(m) {
        this.setMessage(m, false);
      };

      this.error = function(m) {
        this.setMessage(m, true);
      };

      this.isError = function() {
        return this.getMessage().is_error;
      }
    }
})();