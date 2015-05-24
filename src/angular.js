
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

let ngModule = 'monad.core';

function config($translateProvider, $translatePartialLoaderProvider, $routeProvider, $locationProvider) {
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
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: '{part}/i18n/{lang}.json'
    });
    $translateProvider.preferredLanguage('en');
    $translatePartialLoaderProvider.addPart('../monad');
};

angular.module(ngModule, ['ng', 'ngRoute', 'pascalprecht.translate', 'ngSanitize', 'ui.bootstrap', Directives])
    .config(['$translateProvider', '$translatePartialLoaderProvider', '$routeProvider', '$locationProvider', config])
    .run(['$http', '$rootScope', '$translate', '$route', '$cacheFactory', ($http, $rootScope, $translate, $route, $cacheFactory) => {
        normalizePost($http);
        $rootScope.$on('$translatePartialLoaderStructureChanged', () => $translate.refresh());
        $route.reset = () => {
            let caches = $cacheFactory.info();
            for (let cache in caches) {
                if (cache == 'templates') {
                    continue;
                }
                $cacheFactory.get(cache).removeAll();
            }
        };
    }])
    .controller('moController', RootController)
    .service('moNavigation', Navigation)
    .service('moAuthentication', Authentication)
    .service('moLanguage', Language)
    .value('title', 'Default generic administrator')
    .value('languages', ['en', 'nl'])
    .value('theme', '../monad/default.css')
    .value('ckeditor', {})
    ;

window.monad = new Monad();

export default ngModule;

