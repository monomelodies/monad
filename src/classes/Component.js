
"use strict";

import {ListController} from '../controllers/ListController';
import {CrudController} from '../controllers/CrudController';
import {Navigation} from '../services/Navigation';

let nav = new Navigation();
let defaults = {
    list: {
        options: {
            controller: ListController,
            controllerAs: 'list',
            templateUrl: '../monad/templates/list.html'
        }
    },
    crud: {
        options: {
            controller: CrudController,
            controllerAs: 'crud'
        }
    }
};
let interfacer = angular.module('monad.interface', []);

class Component {

    constructor(name, dependencies = [], configFn = undefined) {
        this.paths = {};
        this.name = name;
        this.$manager = undefined;
        this.dependencies = dependencies;
        this.configFn = configFn;
        this.queued = [];

        for (let prop in interfacer) {
            if (typeof interfacer[prop] == 'function') {
                this[prop] = (...args) => {
                    this.queued.push([prop].concat(args));
                    return this;
                };
            }
        }
    }

    bootstrap() {
        let deps = [];
        this.dependencies.map(dep => {
            if (typeof dep == 'object' && dep instanceof Component) {
                deps.push(dep.name);
            } else {
                deps.push(dep);
            }
        });
        this.ngmod = angular.module(this.name, deps, this.configFn);
        this.queued.map(proxy => {
            let fn = proxy.shift();
            if (typeof fn == 'string') {
                this.ngmod[fn](...proxy);
            } else {
                fn(...proxy);
            }
        });
    }

    extend(component) {
    }

    list(url, options = {}, resolve = {}) {
        // Defaults for options:
        options = angular.extend({}, defaults.list.options, options);
        delete options.template; // Don't do this.

        // Defaults for resolve:
        resolve.Manager = resolve.Manager || [normalize(this.name) + 'Manager', Manager => Manager];

        // It's easier if we can specify 'columns' on the options:
        if ('columns' in options) {
            let columns = options.columns;
            resolve.columns = () => columns;
            delete options.columns;
        }

        if (!('menu' in options) || options.menu) {
            nav.register(options.menu || 'main', '/:language' + url, 'monad.navigation.' + normalize(this.name, '.$1'));
        }
        delete(options.menu);

        this.settings.list = {url, options, resolve};
        addTarget.call(this, url, options, resolve);
        this.paths.list = '/:language' + url;
        return this;
    }

    update(url, options = {}, resolve = {}) {
        // Defaults for options:
        options = angular.extend({}, defaults.crud.options, options);
        options.templateUrl = options.templateUrl || this.name + '/schema.html';
        delete options.template; // Don't do this.

        // Defaults for resolve:
        resolve.Manager = resolve.Manager || [normalize(this.name) + 'Manager', Manager => Manager];

        this.settings.update = {url, options, resolve};
        addTarget.call(this, url, options, resolve);
        this.paths.update = '/:language' + url;
        return this;
    }

    manager(Manager) {
        this.$manager = normalize(this.name) + 'Manager';
        this.service(this.$manager, Manager);
        return this;
    }

};

/**
 * Private helper-functions:
 * {{{
 */
function addTarget(url, options = {}, resolve = {}) {
    resolve.module = () => this.name;
    options.resolve = resolve;
    this.queued.push(['config', ['$routeProvider', '$translatePartialLoaderProvider', ($routeProvider, $translatePartialLoaderProvider) => {
        $routeProvider.when('/:language' + url, options);
        $translatePartialLoaderProvider.addPart(this.name);
    }]]);
};

function normalize(name, replace = undefined) {
    if (replace == undefined) {
        replace = match => match.substring(1).toUpperCase();
    }
    return name.replace(/\/(\w)/g, replace);
};
/** }}} */

export {Component};

