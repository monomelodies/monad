
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
        this.$bootstrapped = false;
        this.defaults = angular.extend({}, defaults);
        this.settings = {};

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
        if (this.$bootstrapped) {
            return;
        }
        this.$bootstrapped = true;
        let deps = [];
        this.dependencies.map(dep => {
            if (typeof dep == 'string' && monad.exists(dep)) {
                dep = monad.component(dep);
            }
            if (typeof dep == 'object' && dep instanceof Component) {
                dep.bootstrap();
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
                fn.apply(this, proxy);
            }
        });
    }

    extend(...components) {
        components.map(component => {
            if (typeof component == 'string') {
                if (monad.exists(component)) {
                    component = monad.component(component);
                } else {
                    throw `Component ${component} is undefined and cannot be extended upon.`;
                }
            }
            this.defaults = merge(this.defaults, component.defaults);
        });
    }

    list(url, options = {}, resolve = {}) {
        // Defaults for options:
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
        this.queued.push([addTarget, 'list']);
        return this;
    }

    update(url, options = {}, resolve = {}) {
        // Defaults for options:
        options.templateUrl = options.templateUrl || this.name + '/schema.html';
        delete options.template; // Don't do this.

        // Defaults for resolve:
        resolve.Manager = resolve.Manager || [normalize(this.name) + 'Manager', Manager => Manager];

        this.settings.update = {url, options, resolve};
        this.queued.push([addTarget, 'update']);
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
function addTarget(type) {
    let settings = merge(this.defaults[type], this.settings[type]);
    settings.resolve = settings.resolve || {};
    settings.resolve.module = () => this.name;
    settings.options.resolve = settings.resolve;
    this.ngmod.config(['$routeProvider', '$translatePartialLoaderProvider', ($routeProvider, $translatePartialLoaderProvider) => {
        $routeProvider.when('/:language' + settings.url, settings.options);
        $translatePartialLoaderProvider.addPart(this.name);
    }]);
};

function normalize(name, replace = undefined) {
    if (replace == undefined) {
        replace = match => match.substring(1).toUpperCase();
    }
    return name.replace(/\/(\w)/g, replace);
};

function merge(...args) {
    let merged = {};
    args.map(arg => {
        for (let prop in arg) {
            if (!(prop in merged)) {
                merged[prop] = arg[prop];
                continue;
            }
            if (typeof merged[prop] != typeof arg[prop]) {
                merged[prop] = arg[prop];
                continue;
            }
            if (angular.isArray(merged[prop]) != angular.isArray(arg[prop])) {
                merged[prop] = arg[prop];
                continue;
            }
            if (angular.isArray(merged[prop]) && angular.isArray(arg[prop])) {
                arg[prop].map(elem => {
                    if (merged[prop].indexOf(elem) == -1) {
                        merged[prop].push(elem);
                    }
                });
                continue;
            }
            if (typeof arg[prop] != 'object') {
                merged[prop] = arg[prop];
                continue;
            }
            merged[prop] = merge(merged[prop], arg[prop]);
        }
    });
    return merged;
};

/** }}} */

export {Component};

