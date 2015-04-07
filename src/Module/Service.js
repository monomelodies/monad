
"use strict";

let injector;

class Service {

    constructor($injector) {
        injector = $injector;
    }

    static register(name, components) {
        for (let service in components) {
            angular.module('monad').service(name + '.' + service, components[service]);
        }
    }

    retrieve(name) {
        return {
            Service: injector.get(name + '.Service'),
            Model: injector.get(name + '.Model')
        };
    }

    /*
    for (var name in items) {
        ['Controller', 'Service'].map(function(type) {
            if (type in items[name]) {
                app[type.toLowerCase()](name + '.' + type, items[name][type]);
            } else {
            }
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
    */

};

Service.$inject = ['$injector'];

export {Service};

