var modules = [
  'ngCookies',
  'ui.router',

  // Service
  'app.service',

  // Directive
  'app.factory',

    // Directive
  'app.directive',

  'app.component',
];

// Front office app
angular.module('app', modules);
angular.module('app.auth', modules);