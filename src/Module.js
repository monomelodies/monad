
"use strict";

import {Controller as ListController} from './Data/List/Controller';
import {ItemController} from './Data/Item/Controller';

let registeredModules = {};

class Module {

    constructor(name, defs) {
        this.app = name;
        for (let key in defs) {
            this[key] = defs[key];
        }
    }

    static register(name, definition) {
        let dependencies = definition.depends || [];
        let app = angular.module(name, dependencies);
        let resolve = {Module: () => Module.retrieve(name)};
        /*
            Module: m,
            Model: () => angular.injector([app]).get('Model'),
            Service: () => angular.injector([app]).get('Service')
        };
        */
        registeredModules[name] = registeredModules[name] || {};
        app.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
            if ('list' in definition) {
                registeredModules[name].listUrl = '/:language' + definition.list.url;
                $routeProvider.when('/:language' + definition.list.url, {
                    controller: definition.list.controller || ListController,
                    controllerAs: 'data',
                    templateUrl: definition.list.template || 'monad/src/Data/List/rows.html',
                    resolve
                });
            }
            if ('item' in definition) {
                registeredModules[name].itemUrl = '/:language' + definition.item.url;
                $routeProvider.when('/:language' + definition.item.url, {
                    controller: definition.item.controller || ItemController,
                    controllerAs: 'data',
                    templateUrl: definition.item.template || 'monad/src/Data/Item/update.html',
                    resolve
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
        ['Repository', 'Schema', 'Model', 'Controller'].map(key => {
            if (key in definition) {
                registeredModules[name][key] = definition[key];
            }
        });
        return name;
    }

    static retrieve(name) {
        return new Module(name, registeredModules[name] || {});
    }

};

Module.$inject = [];

angular.module('monad.Core').service('Module', Module);

export {Module};

