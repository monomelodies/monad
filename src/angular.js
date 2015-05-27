
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

function config($translateProvider, $translatePartialLoaderProvider, $routeProvider, $locationProvider, languages) {
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
    $translateProvider.preferredLanguage(languages[0]);
    $translatePartialLoaderProvider.addPart('../monad');
};

angular.module('monad.core', ['ng', 'ngRoute', 'pascalprecht.translate', 'ngSanitize', 'ui.bootstrap', Directives])
    .config(['$translateProvider', '$translatePartialLoaderProvider', '$routeProvider', '$locationProvider', 'languages', config])
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
    .constant('languages', ['en', 'nl'])
    .value('theme', '../monad/default.css')
    ;

let monad = new Monad();

let bootstrap = angular.bootstrap;

angular.bootstrap = (...args) => {
    window.monad.bootstrap();
    bootstrap(...args);
};

export {monad};

