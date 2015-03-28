
import angular from 'angular';
import * as router from 'angular-ui-router';
import * as translate from 'angular-translate';
import * as bootstrap from './core/bootstrap';
import * as Home from './Home/app';

var Monad = angular.module('monad', ['pascalprecht.translate', 'ui.router']);

Monad.run(['$http', bootstrap.NormalizePost]);
Monad.config(['$translateProvider', function($translateProvider) {
    $translateProvider.preferredLanguage('en');
}]);
Monad.config(['$stateProvider', Home.Config]);
Monad.controller('RootController', bootstrap.Controller);

export { Monad as default };

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

