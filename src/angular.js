
"use strict";

import 'babel-polyfill';
import 'angular';
import 'angular-ui-bootstrap';
import 'angular-route';
import 'angular-sanitize';
import 'angular-animate';
import 'angular-resource';
import 'autofill-event';
import 'angular-gettext';
import 'ng-lollipop';
import '../i18n';
import '../templates';
import ListController from './ListController';
import Navigation from './services/Navigation';
import Authentication from './services/Authentication';
import Language from './services/Language';
import Delete from './services/Delete';
import Report from './services/Report';
import './directives/angular';
import './components/angular';
import Model from './factories/Model';
import Resource from './factories/Resource';

angular.module('monad.ng', ['ng', 'ngRoute', 'ngSanitize', 'ngAnimate', 'ngResource']);
angular.module('monad.externals', ['gettext', 'ui.bootstrap', 'lollipop']);
angular.module('monad', ['monad.ng', 'monad.externals', 'monad.directives', 'monad.components', 'monad.templates'])
    // No HTML5 mode please
    .config(['$locationProvider', $locationProvider => {
        $locationProvider.html5Mode(false);
    }])
    // Bare bones routing
    .config(['$routeProvider', $routeProvider => {
        $routeProvider.
            when('/', {
                template: '<noop></noop>',
                controller: ['moLanguage', '$location', (moLanguage, $location) => {
                    $location.path('/' + moLanguage.current + '/');
                }]
            }).
            when('/:language/', {
                templateUrl: '/monad/templates/home.html'
            });
    }])
    // Set defaults (these can/should be overridden)
    .run(['$rootScope', '$location', ($rootScope, $location) => {
        $rootScope.languages = ['en', 'nl'];
        $rootScope.title = 'Default generic administrator';
        $rootScope.liveReload = undefined;
        $rootScope.$on('$routeChangeSuccess', () => {
            $rootScope.isHome = $location.path().match(/^\/[a-z]{2}\/$/);
        });
    }])
    // Set default language
    .run(['$rootScope', 'moLanguage', ($rootScope, moLanguage) => {
        moLanguage.current = $rootScope.languages[0];
        $rootScope.Language = moLanguage;
    }])
    // Register route reset handler
    .run(['$rootScope', '$route', '$cacheFactory', ($rootScope, $route, $cacheFactory) => {
        $route.reset = () => {
            let caches = $cacheFactory.info();
            for (let cache in caches) {
                if (cache == 'templates') {
                    continue;
                }
                $cacheFactory.get(cache).removeAll();
            }
            $route.reload();
            $rootScope.$broadcast('monad:reset');
        };
    }])
    // Register navigation service
    .run(['$rootScope', 'moNavigation', ($rootScope, moNavigation) => {
        $rootScope.Navigation = moNavigation;
    }])
    // Register reporting service
    .run(['$rootScope', 'moReport', ($rootScope, moReport) => {
        $rootScope.messages = moReport.messages;
    }])
    // Initialize session
    .run(['$rootScope', 'Authentication', ($rootScope, Authentication) => {
        $rootScope.$on('$routeChangeStart', () => Authentication['status']());
        $rootScope.Authentication = Authentication;
    }])
    // Normalize HTTP data using ng-lollipop
    .run(['normalizeIncomingHttpData', 'postRegularForm', (a, b) => {}])

    // Factories
    .factory('moResource', Resource)
    .factory('moModel', Model)

    // Default controllers
    .controller('moListController', ListController)

    // Services
    .service('moNavigation', Navigation)
    .service('Authentication', Authentication)
    .service('moLanguage', Language)
    .service('moReport', Report)
    .service('moDelete', Delete)
    ;

