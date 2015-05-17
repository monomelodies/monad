
"use strict";

import {RootController} from './src/controllers/RootController';
import {HomeController} from './src/controllers/HomeController';
import {LoginController} from './src/controllers/LoginController';
import {Navigation} from './src/services/Navigation';
import {default as normalizePost} from './src/helpers/post';
import {default as Directives} from './src/directives/angular';

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
            templateUrl: 'monad/src/templates/home.html'
        }).
        when('/:language/login/', {
            controller: LoginController,
            controllerAs: 'login',
            templateUrl: 'monad/src/templates/login.html'
        });
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/i18n/{lang}.json'
    });
    $translateProvider.preferredLanguage('en');
    $translatePartialLoaderProvider.addPart('monad/src');
};

angular.module(ngModule, ['ng', 'ngRoute', 'pascalprecht.translate', 'ckeditor', 'ngSanitize', 'ngFileUpload', 'ui.bootstrap', Directives])
    .config(['$translateProvider', '$translatePartialLoaderProvider', '$routeProvider', '$locationProvider', config])
    .run(['$http', '$rootScope', '$translate', ($http, $rootScope, $translate) => {
        normalizePost($http);
        $rootScope.$on('$translatePartialLoaderStructureChanged', () => $translate.refresh());
    }])
    .controller('moController', RootController)
    .controller('moHomeController', HomeController)
    .service('moNavigation', Navigation)
;

export default ngModule;

