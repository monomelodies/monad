
"use strict";

import {Controller} from './src/Controller';
import {Navigation} from './src/Navigation';
import {default as Home} from './src/home/angular';

let ngModule = 'monad.core';

function config($translateProvider, $translatePartialLoaderProvider, $routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);
    $routeProvider.
        when('/', {
            controller: 'moController'
        }).
        when('/:language/', {
            controller: 'moHomeController',
            controllerAs: 'home',
            templateUrl: 'monad/template/home.html'
        }).
        when('/:language/login/', {
            controller: 'moLoginController',
            controllerAs: 'login',
            templateUrl: 'monad/template/login.html'
        });
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/i18n/{lang}.json'
    });
    $translateProvider.preferredLanguage('en');
};

angular.module(ngModule, ['ng', 'ngRoute', 'pascalprecht.translate', 'ngCkeditor', 'ngSanitize', 'angularFileUpload', 'ui.bootstrap', Home])
    .config(['$translateProvider', '$translatePartialLoaderProvider', '$routeProvider', '$locationProvider', config])
    .controller('moController', Controller)
    .service('moNavigation', Navigation)
;

export default ngModule;

