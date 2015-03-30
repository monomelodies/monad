
import angular from 'angular';
import * as router from 'angular-ui-router';
import * as translate from 'angular-translate';
import {NormalizePost} from './core/NormalizePost';
import {Controller} from './core/Controller';
//import {Module} from './core/Module';
import * as Home from './Home/module';
import * as Auth from './Auth/module';
//import * as Module from './Module/module';

var app = angular.module('monad', ['pascalprecht.translate', 'ui.router']);

app.run(['$http', NormalizePost]);
app.config(['$translateProvider', '$stateProvider', function($translateProvider, $stateProvider) {
    $translateProvider.preferredLanguage('en');
    Home.ngConfig($stateProvider);
    Auth.ngConfig($stateProvider);
    Module.ngConfig($stateProvider);
}]);
app.controller('RootController', Controller);

//export {Controller, Module};
export {Controller};

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

