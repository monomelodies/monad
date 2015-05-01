
"use strict";

import {Controller as ListController} from './Data/List/Controller';
import {Controller as ItemController} from './Data/Item/Controller';

let registeredModules = {};

export function Module(name, dependencies = [], config = {} {

    dependencies.push('ng');
    let app = angular.module(name, dependencies);
    ['list', 'create', 'update', 'delete'].map(prop => {
    });
    return app;

    /*
    constructor(name, defs) {
        this.app = name;
        for (let key in defs) {
            this[key] = defs[key];
        }
    }

    static register(name, definition) {
        let dependencies = [].concat(definition.depends || [], ['monad.Core']);
        let app = angular.module(name, dependencies);
        let resolve = {Module: () => Module.retrieve(name)};
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
                if (['Repository'].indexOf(key) != -1) {
                    app.service(key, definition[key]);
                }
            }
        });
        return name;
    }

    static retrieve(name) {
        return new Module(name, registeredModules[name] || {});
    }
    */

};

