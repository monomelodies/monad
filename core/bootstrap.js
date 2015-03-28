
import {Controller} from './Controller';

function NormalizePost($http)
{
    delete $http.defaults.headers.common['X-Requested-With'];
    $http.defaults.withCredentials = true;
    $http.defaults.headers.post["Content-Type"] = 'application/x-www-form-urlencoded;charset=utf-8';
    
    // http://victorblog.com/2012/12/20/make-angularjs-http-service-behave-like-jquery-ajax/
    function param(obj) {
        var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
        for (name in obj) {
            value = obj[name];
            if (value instanceof Array) {
                for (i = 0; i < value.length; ++i) {
                    subValue = value[i];
                    fullSubName = name + '[' + i + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value instanceof Object) {
                for (subName in value) {
                    subValue = value[subName];
                    fullSubName = name + '[' + subName + ']';
                    innerObj = {};
                    innerObj[fullSubName] = subValue;
                    query += param(innerObj) + '&';
                }
            } else if (value !== undefined && value !== null) {
                query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
        }
        return query.length ? query.substr(0, query.length - 1) : query;
    };
    // Override $http service's default transformRequest
    $http.defaults.transformRequest = [function(data) {
        return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
    }];
}

function register(app, items)
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

export {NormalizePost, Controller, register};

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

