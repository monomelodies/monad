
"use strict";

import ListController from '../controllers/ListController';
import CrudController from '../controllers/CrudController';
import Navigation from '../services/Navigation';

let defaults = {
    list: {
        options: {
            controller: ListController,
            controllerAs: 'list'
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
        resolve: {$mapping: {item: 'Manager'}}
    }
};
let interfacer = angular.module('monad.interface', []);

export default class Component {

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
        this.ngmod.run(['gettextCatalog', Catalog => {
            if (this.texts) {
                for (let key in this.texts) {
                    this.texts[key] = Catalog.getString(this.texts[key]);
                }
            }
        }]);
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
        return this;
    }
    
    authentication(auth) {
        this.defaults = merge(this.defaults, {
            list: {resolve: {Authentication: auth}},
            create: {resolve: {Authentication: auth}},
            update: {resolve: {Authentication: auth}}
        });
        return this;
    }

    texts(keyValue) {
        this._texts = keyValue;
        return this;
    }

    list(url, options = {}, resolve = {}) {
        options.templateUrl = options.templateUrl || this.name + '/list.html';
        // It's easier if we can specify 'columns' on the options:
        if ('columns' in options) {
            let columns = options.columns;
            resolve.columns = () => columns;
            delete options.columns;
        }

        if (!('menu' in options) || options.menu) {
            Navigation.register(this.name, options.menu || 'main', '/:language' + url);//, 'monad.navigation.' + normalize(this.name, '.$1'));
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
        let $mapping = angular.copy(settings.resolve.$mapping);
        settings.resolve.$mapping = () => $mapping;
    }
    if (type == 'create') {
        settings.resolve.item = [this.$manager.name, Manager => new Manager.model];
    }
    let name;
    if ('Authentication' in settings.resolve) {
        name = normalize(this.name) + '_' + type + 'Authentication';
        this.ngmod.service(name, settings.resolve.Authentication);
    } else {
        name = 'Authentication';
    }
    settings.resolve.Authentication = [name, Authentication => Authentication];
    settings.options.resolve = settings.resolve;
    delete settings.options.template; // Don't do this.
    if (settings.url) {
        this.ngmod.config(['$routeProvider', $routeProvider => {
            $routeProvider.when('/:language' + settings.url, settings.options);
        }]);
    }
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

