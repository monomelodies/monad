
"use strict";

import ListController from './controllers/ListController';
import Navigation from './services/Navigation';
import Authentication from './services/Authentication';
import Language from './services/Language';
import Report from './services/Report';
import './directives/angular';
import './components/angular';
import 'ng-lollipop';

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
    .run(['$rootScope', $rootScope => {
        $rootScope.languages = ['en', 'nl'];
        $rootScope.title = 'Default generic administrator';
        $rootScope.liveReload = undefined;
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
    // Initialize session
    .run(['$rootScope', 'Authentication', ($rootScope, Authentication) => {
        $rootScope.$on('$routeChangeStart', () => Authentication['status']());//.then(() => Navigation.clear()));
        $rootScope.Authentication = Authentication;
    }])
    // Normalize HTTP data using ng-lollipop
    .run(['normalizeIncomingHttpData', 'postRegularForm', (a, b) => {}])

    // Default controllers
    .controller('moListController', ListController)

    .service('moNavigation', Navigation)
    .service('Authentication', Authentication)
    .service('moLanguage', Language)
    .service('moReport', Report)
    ;

