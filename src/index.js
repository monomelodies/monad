
"use strict";

import pkg from '../package.json';
const version = pkg.version;

import 'babel-polyfill';
import angular from 'angular';
import uiBootstrap from 'angular-ui-bootstrap';
import ngRoute from 'angular-route';
import ngSanitize from 'angular-sanitize';
import ngAnimate from 'angular-animate';
import ngResource from 'angular-resource';
import 'autofill-event';
import lollipop from 'ng-lollipop';
import '../lib/templates';
import Authentication from './services/Authentication';
import Report from './services/Report';
import Progress from './services/Progress';
import Location from './services/Location';
import Language from './services/Language';
import directives from './directives';
import components from './components';

let ng = angular.module('monad.ng', ['ng', ngRoute, ngSanitize, ngAnimate]).name;
let externals = angular.module('monad.externals', [uiBootstrap, lollipop]).name;
export default angular.module('monad.cms', [ng, externals, directives, components, 'monad.templates'])
    .constant('MONAD_VERSION', version)
    .constant('MONAD_COPYRIGHT', [2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017])
    .service('monadLanguageService', Language)
    .factory('gettext', () => txt => txt)
    .filter('translate', () => txt => txt)
    // Bare bones routing
    .config(['$routeProvider', $routeProvider => {
        $routeProvider.
            when('/', {
                templateUrl: 'Monad/templates/home.html'
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
    // Register reporting service
    .run(['$rootScope', 'monadReport', ($rootScope, monadReport) => {
        $rootScope.messages = monadReport.messages;
    }])
    // Initialize session
    .run(['$rootScope', 'Authentication', ($rootScope, Authentication) => {
        $rootScope.$on('$routeChangeStart', () => Authentication['status']());
    }])
    // Normalize HTTP data using ng-lollipop
    .run(['normalizeIncomingHttpData', 'postRegularForm', (a, b) => {}])

    .service('Authentication', Authentication)
    .service('monadLocation', Location)
    .service('monadReport', Report)
    .service('monadProgress', Progress)
    ;

