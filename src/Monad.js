
var angular = require('angular');
require('angular-translate');

import * as Core from './Core/app';
import * as Authentication from './Authentication/app';
import * as Home from './Home/app';
import * as Module from './Module/app';

var app = angular.module('monad', ['pascalprecht.translate', require('angular-route')]);

app.run(['$http', Core.normalizePost]);
app.config(['$translateProvider', '$routeProvider', '$locationProvider', function($translateProvider, $routeProvider, $locationProvider) {
    $translateProvider.preferredLanguage('en');
    $locationProvider.html5Mode(false);
    $routeProvider.
        when('/', {
            controller: Home.Controller,
            controllerAs: 'home',
            templateUrl: 'monad/src/Home/dashboard.html'
        }).
        when('/login/', {
            controller: Authentication.LoginController,
            controllerAs: 'login',
            templateUrl: 'monad/src/Authentication/login.html'
        }).
        when('/module/:module/', {
            controller: Module.ListController,
            controllerAs: 'list',
            templateUrl: 'monad/src/Module/list.html'
        }).
        when('/module/:module/{id:[0-9A-Za-z=]{1,}}/', {
            controller: Module.ItemController,
            controllerAs: 'item',
            templateUrl: 'monad/src/Module/item.html'
        });
}]);
app.controller('RootController', Core.Controller);
app.service('AuthenticationService', Authentication.Service);
app.service('ModuleService', Module.Service);

export {Core as Monad};

