(function() {
'use strict';

angular.module('app').controller('DemoController', DemoController);

function DemoController($state, $stateParams, ApiService, LoadingService, StateFactory,
FlashMessageService) {
    var vm = this;

    this.files = null; // Store files object

    this.fm = FlashMessageService;
    this.ls = LoadingService;

    this.testUploadFiles = function() {
        console.log('controller', this.files);
        
        ApiService.Demo.upload({
            'files': vm.files
        }).then(function(resp) {
            console.log('resp', resp);
        });
    };

    this.create = function() {
        console.log('create');
    };
};
})();