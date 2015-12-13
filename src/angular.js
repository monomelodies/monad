
"use strict";

import '../node_modules/babel-polyfill/dist/polyfill.js';
import '../bower_components/angular/angular.js';
import '../bower_components/angular-bootstrap/ui-bootstrap.js';
import '../bower_components/angular-bootstrap/ui-bootstrap-tpls.js';
import '../bower_components/angular-route/angular-route.js';
import '../bower_components/angular-sanitize/angular-sanitize.js';
import '../bower_components/angular-animate/angular-animate.js';
import '../bower_components/autofill-event/src/autofill-event.js';
import '../bower_components/angular-gettext/dist/angular-gettext.js';

import Monad from './classes/Monad';
import RootController from './controllers/RootController';
import HomeController from './controllers/HomeController';
import LoginController from './controllers/LoginController';
import Navigation from './services/Navigation';
import Authentication from './services/Authentication';
import Language from './services/Language';
import Report from './services/Report';
import normalizePost from './helpers/post';
import Directives from './directives/angular';

function config($routeProvider, $locationProvider) {
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
};

function run(Language, languages, $http, $route, $cacheFactory) {
    normalizePost($http);
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
    };
};

angular.module('monad.core', ['ng', 'ngRoute', 'gettext', 'ngSanitize', 'ngAnimate', 'ui.bootstrap', Directives])
    .config(['$routeProvider', '$locationProvider', config])
    .run(['moLanguage', 'languages', '$http', '$route', '$cacheFactory', run])
    .controller('moController', RootController)
    .service('moNavigation', Navigation)
    .service('Authentication', Authentication)
    .service('moLanguage', Language)
    .service('moReport', Report)
    .value('title', 'Default generic administrator')
    .value('liveReload', undefined)
    .constant('languages', ['en', 'nl'])
    .value('theme', '../monad/default.css')
    ;

let monad = new Monad();
window.monad = monad;

export default monad;

