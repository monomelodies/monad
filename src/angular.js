
"use strict";

import Monad from './classes/Monad';
import RootController from './controllers/RootController';
import HomeController from './controllers/HomeController';
import Navigation from './services/Navigation';
import Authentication from './services/Authentication';
import Language from './services/Language';
import Report from './services/Report';
import Directives from './directives/angular';
import 'ng-lollipop';

function config($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false);
    $routeProvider.
        when('/', {
            controller: 'moController'
        }).
        when('/:language/', {
            controller: HomeController,
            controllerAs: 'home',
            templateUrl: '/monad/templates/home.html'
        });
};

function run($rootScope, Language, languages, $route, $cacheFactory) {
    Language.current = languages[0];
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
};

angular.module('monad.core', ['ng', 'ngRoute', 'gettext', 'ngSanitize', 'ngAnimate', 'ui.bootstrap', Directives, 'monad.templates', 'lollipop'])
    .config(['$routeProvider', '$locationProvider', config])
    .run(['$rootScope', 'moLanguage', 'languages', '$http', '$route', '$cacheFactory', run])
    .run(['normalizeIncomingHttpData', 'postRegularForm', (a, b) => {}])
    .controller('moController', RootController)
    .service('moNavigation', Navigation)
    .service('Authentication', Authentication)
    .service('moLanguage', Language)
    .service('moReport', Report)
    .value('title', 'Default generic administrator')
    .value('liveReload', undefined)
    .constant('languages', ['en', 'nl'])
    ;

let monad = new Monad();
window.monad = monad;

export default monad;

