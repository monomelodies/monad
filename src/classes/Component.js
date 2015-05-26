
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
    create: {
        options: {
            controller: CrudController,
            controllerAs: 'crud'
        },
        resolve: {$mapping: {item: 'Manager'}}
    },
    update: {
        options: {
            controller: CrudController,
            controllerAs: 'crud'
        },
        resolve: {'$mapping': {item: 'Manager'}}
    }
};
let interfacer = angular.module('monad.interface', []);

class Component {

    constructor(name, dependencies = [], configFn = undefined) {
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
            this.dependencies.push(component);
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

    create(url, options = {}, resolve = {}) {
        options.templateUrl = options.templateUrl || this.name + '/schema.html';
        delete options.create;
        this.settings.create = {url, options, resolve};
        this.queued.push([addTarget, 'create']);
        return this;
    }

    update(url, options = {}, resolve = {}) {
        options.templateUrl = options.templateUrl || this.name + '/schema.html';
        if (options.create) {
            this.create(options.create, options, resolve);
            delete options.create;
        }
        this.settings.update = {url, options, resolve};
        this.queued.push([addTarget, 'update']);
        return this;
    }

    manager(Manager) {
        this.$manager = {name: normalize(this.name) + 'Manager', obj: Manager};
        this.service(this.$manager.name, this.$manager.obj);
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
    settings.resolve.Manager = settings.resolve.Manager || [normalize(this.name) + 'Manager', Manager => Manager];
    settings.resolve.module = () => this;
    if ('$mapping' in settings.resolve) {
        settings.resolve.$mapping = () => settings.resolve.$mapping;
    }
    settings.options.resolve = settings.resolve;
    delete settings.options.template; // Don't do this.
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
        if (arg == undefined || arg == null || typeof arg != 'object') {
            return;
        }
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

