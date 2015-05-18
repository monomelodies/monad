
"use strict";

import {Monad} from './Monad';
import {RootController} from './controllers/RootController';
import {HomeController} from './controllers/HomeController';
import {LoginController} from './controllers/LoginController';
import {Navigation} from './services/Navigation';
import {default as normalizePost} from './helpers/post';
import {default as Directives} from './directives/angular';

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
            templateUrl: '../monad/templates/home.html'
        }).
        when('/:language/login/', {
            controller: LoginController,
            controllerAs: 'login',
            templateUrl: '../monad/templates/login.html'
        });
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/i18n/{lang}.json'
    });
    $translateProvider.preferredLanguage('en');
    $translatePartialLoaderProvider.addPart('../monad');
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

window.monad = new Monad();

export default ngModule;

