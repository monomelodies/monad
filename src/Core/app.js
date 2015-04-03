
import {normalizePost} from './normalizePost';
import {Controller} from './Controller';

function Module(app, items)
{
    for (var name in items) {
        ['Controller', 'Service'].map(function(type) {
            app[type.toLowerCase()](name + '.' + type, items[name][type]);
        });
        app.config(['$stateProvider', function($stateProvider) {
            $stateProvider.
                state(name, {
                    url: '/' + name.toLowerCase() + '/',
                    controller: items[name].Controller,
                    controllerAs: 'list',
                    templateUrl: './' + name + '/view.html'
                });
        }]);
    }
}

export {normalizePost, Module};
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

