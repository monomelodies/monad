
"use strict";

let registeredModules = {};

class Module {

    constructor(...args) {
        args.map((arg, i) => {
            let name = Module.$inject[i];
            let parts = name.split('.');
            let module = parts.shift();
            let param = parts.join('.');
            registeredModules[module][param] = arg;
        });
    }

    static register(name, definition) {
        var dependencies = definition.depends || [];
        var app = angular.module(name, dependencies);
        registeredModules[name] = registeredModules[name] || {};
        app.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
            if ('list' in definition) {
                registeredModules[name].listUrl = '/:language' + definition.list.url;
                $routeProvider.when('/:language' + definition.list.url, {
                    controller: definition.list.controller || 'Data.ListController',
                    controllerAs: 'data',
                    templateUrl: definition.list.template || 'monad/src/Data/list.html',
                    resolve: {app: () => name}
                });
            }
            if ('item' in definition) {
                registeredModules[name].itemUrl = '/:language' + definition.item.url;
                $routeProvider.when('/:language' + definition.item.url, {
                    controller: definition.item.controller || 'Data.ItemController',
                    controllerAs: 'data',
                    templateUrl: definition.item.template || 'monad/src/Data/item.html',
                    resolve: {app: () => name}
                });
            }
            if ('texts' in definition) {
                for (let language in definition.texts) {
                    var texts = {};
                    texts[name] = definition.texts[language];
                    $translateProvider.translations(language, texts);
                }
            }
        }]);
        if ('service' in definition) {
            Module.$inject.push(name + '.Service');
            app.service(name + '.Service', definition.service);
        }
        if ('model' in definition) {
            Module.$inject.push(name + '.Model');
            app.service(name + '.Model', definition.model);
            registeredModules[name].Meta = definition.model;
        }
        return name;
    }

    retrieve(name) {
        return registeredModules[name] || {};
    }

};

Module.$inject = [];

angular.module('monad.Core').service('Module', Module);

export {Module};

