
"use strict";

import {Monad} from './classes/Monad';
import {RootController} from './controllers/RootController';
import {HomeController} from './controllers/HomeController';
import {LoginController} from './controllers/LoginController';
import {Navigation} from './services/Navigation';
import {Authentication} from './services/Authentication';
import {Language} from './services/Language';
import {default as normalizePost} from './helpers/post';
import {default as Directives} from './directives/angular';

function config($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);
    $routeProvider.
        when('/', {
            controller: 'moController'
        }).
        when('/:language/', {
            controller: HomeController,
            controllerAs: 'home',
            templateUrl: '../monad/templates/home.html'
        }).
        when('/:language/login/', {
            controller: LoginController,
            controllerAs: 'login',
            templateUrl: '../monad/templates/login.html'
        });
};

function run(gettextCatalog, languages, $http, $rootScope, $route, $cacheFactory) {
    normalizePost($http);
    gettextCatalog.setCurrentLanguage(languages[0]);
    gettextCatalog.loadRemote('../js/i18n/' + languages[0] + '.json');
};

angular.module('monad.core', ['ng', 'ngRoute', 'gettext', 'ngSanitize', 'ui.bootstrap', Directives])
    .config(['$routeProvider', '$locationProvider', config])
    .run(['gettextCatalog', 'languages', '$http', '$rootScope', '$route', '$cacheFactory', run])
    .controller('moController', RootController)
    .service('moNavigation', Navigation)
    .service('Authentication', Authentication)
    .service('moLanguage', Language)
    .value('title', 'Default generic administrator')
    .constant('languages', ['en', 'nl'])
    .value('theme', '../monad/default.css')
    ;

let monad = new Monad();
window.monad = monad;

let bootstrap = angular.bootstrap;

angular.bootstrap = (...args) => {
    monad.bootstrap();
    bootstrap(...args);
};

export default monad;

