
"use strict";

import {ListController} from './Data/ListController';
import {ItemController} from './Data/ItemController';

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
        let m = () => Module.retrieve(name);
        let resolve = {
            Module: m,
            Model: [name + '.Model', Model => Model],
            Service: [name + '.Service', Service => Service]
        };
        registeredModules[name] = registeredModules[name] || {};
        app.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
            if ('list' in definition) {
                registeredModules[name].listUrl = '/:language' + definition.list.url;
                $routeProvider.when('/:language' + definition.list.url, {
                    controller: definition.list.controller || ListController,
                    controllerAs: 'data',
                    templateUrl: definition.list.template || 'monad/src/Data/list.html',
                    resolve
                });
            }
            if ('item' in definition) {
                registeredModules[name].itemUrl = '/:language' + definition.item.url;
                $routeProvider.when('/:language' + definition.item.url, {
                    controller: definition.item.controller || ItemController,
                    controllerAs: 'data',
                    templateUrl: definition.item.template || 'monad/src/Data/item.html',
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
        app.service(name + '.Service', definition.service);
        app.service(name + '.Model', definition.model);
        registeredModules[name].Meta = definition.model;
        return name;
    }

    static retrieve(name) {
        return new Module(name, registeredModules[name] || {});
    }

};

Module.$inject = [];

angular.module('monad.Core').service('Module', Module);

export {Module};

