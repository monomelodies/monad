
"use strict";

const version = '3.0.0';

import 'babel-polyfill';
import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';
import ngRoute from 'angular-route';
import ngSanitize from 'angular-sanitize';
import ngAnimate from 'angular-animate';
import ngResource from 'angular-resource';
import 'autofill-event';
import lollipop from 'ng-lollipop';
import './templates';
import ListController from './ListController';
import Navigation from './services/Navigation';
import Authentication from './services/Authentication';
import Language from './services/Language';
import Delete from './services/Delete';
import Report from './services/Report';
import Progress from './services/Progress';
import directives from './directives';
import components from './components';
import Resource from './factories/Resource';

let ng = angular.module('monad.ng', ['ng', ngRoute, ngSanitize, ngAnimate, ngResource]).name;
let externals = angular.module('monad.externals', [uiBootstrap, lollipop]).name;
export default angular.module('monad.cms', [ng, externals, directives, components, 'monad.templates'])
    .constant('MONAD_VERSION', version)
    .factory('monadLanguageService', () => false)
    .factory('gettext', () => txt => txt)
    .filter('translate', () => txt => txt)
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
    .run(['$rootScope', '$location', '$uibModal', ($rootScope, $location, $uibModal) => {
        $rootScope.languages = ['en', 'nl'];
        $rootScope.title = 'Default generic administrator';
        $rootScope.liveReload = undefined;
        $rootScope.$on('$routeChangeSuccess', () => {
            $rootScope.isHome = $location.path().match(/^\/[a-z]{2}\/$/);
        });
        $rootScope.license = () => {
            $uibModal.open({
                templateUrl: '/monad/templates/license.html',
                controller: ['$uibModalInstance', '$scope', function ($uibModalInstance, $scope) {
                    $scope.ok = () => $uibModalInstance.dismiss();
                }]
            });
        };
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
    }])
    // Normalize HTTP data using ng-lollipop
    .run(['normalizeIncomingHttpData', 'postRegularForm', (a, b) => {}])

    // Factories
    .factory('moResource', Resource)

    // Default controllers
    .controller('moListController', ListController)

    // Services
    .service('moNavigation', Navigation)
    .service('Authentication', Authentication)
    .service('moLanguage', Language)
    .service('moReport', Report)
    .service('moDelete', Delete)
    .service('moProgress', Progress)
    ;

