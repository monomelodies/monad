
var angular = require('angular');
require('angular-translate');

import * as Core from './Core/app';
import * as Authentication from './Authentication/app';
import * as Home from './Home/app';
import * as Module from './Module/app';

/*
import * as router from 'angular-ui-router';
import * as translate from 'angular-translate';
import {NormalizePost} from './core/NormalizePost';
import {Controller} from './core/Controller';
//import {Module} from './core/Module';
import * as Auth from './Auth/module';
*/
var app = angular.module('monad', ['pascalprecht.translate', require('angular-route')]);

app.run(['$http', Core.normalizePost]);
app.config(['$translateProvider', '$routeProvider', '$locationProvider', function($translateProvider, $routeProvider, $locationProvider) {
    $translateProvider.preferredLanguage('en');
    $locationProvider.html5Mode(false);
    $routeProvider.
        when('/', {
            controller: Home.Controller,
            controllerAs: 'home',
            templateUrl: 'monad/src/Home/dashboard.html'
        }).
        when('/login/', {
            controller: Authentication.LoginController,
            controllerAs: 'login',
            templateUrl: 'monad/src/Authentication/login.html'
        }).
        when('/module/:module/', {
            controller: Module.ListController,
            controllerAs: 'list',
            templateUrl: 'monad/src/Module/list.html'
        }).
        when('/module/:module/{id:[0-9A-Za-z=]{1,}}/', {
            controller: Module.ItemController,
            controllerAs: 'item',
            templateUrl: 'monad/src/Module/item.html'
        });
    /*
    Home.ngConfig($stateProvider);
    Auth.ngConfig($stateProvider);
    Module.ngConfig($stateProvider);
    */
}]);
app.controller('RootController', Core.Controller);
app.service('AuthenticationService', Authentication.Service);
app.service('ModuleService', Module.Service);

//export {Controller, Module};
export {Core as Monad};

/*
            /*
        }).
        state('login', {
            url: '/login/',
            controller: LoginController,
            controllerAs: 'login',
            templateUrl: 'assets/html/login/view.html'
import {HomeController} from './home/Controller';
import {LoginController} from './login/Controller';

class Monad
{
    constructor() {
        this._angular = angular.module('monad', [
            'ngRoute',
            'ngAnimate',
            'ngSanitize',
            'pascalprecht.translate'
        ]);
        var that = this;
        this._modules = [];
    }
    get angular() {
        return this._angular;
    }
    registerModule(module) {
        this._modules.push(module);
    }
    get modules() {
        return this._modules;
    }
}

class Module
{
    constructor() {
        this._provides = [];
    }
    get provides() {
        return this._provides;
    }
}

var monad = new Monad;
export {monad as Monad, Module};
*/

