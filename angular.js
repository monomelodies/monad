
"use strict";

import {RootController} from './src/controllers/RootController';
import {HomeController} from './src/controllers/HomeController';
import {LoginController} from './src/controllers/LoginController';
import {Navigation} from './src/services/Navigation';
import {default as normalizePost} from './src/helpers/post';
import {default as listHeader} from './src/directives/list/header/directive';
import {default as listTable} from './src/directives/list/table/directive';
import {default as Path} from './src/directives/path/directive';
import {default as Field} from './src/directives/field/directive';

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
};

angular.module(ngModule, ['ng', 'ngRoute', 'pascalprecht.translate', 'ngCkeditor', 'ngSanitize', 'ngFileUpload', 'ui.bootstrap'])
    .config(['$translateProvider', '$translatePartialLoaderProvider', '$routeProvider', '$locationProvider', config])
    .run(['$http', normalizePost])
    .controller('moController', RootController)
    .controller('moHomeController', HomeController)
    .service('moNavigation', Navigation)
    .directive('moListHeader', listHeader)
    .directive('moListTable', listTable)
    .directive('moPath', Path)
    .directive('moField', Field)
;

export default ngModule;

