
"use strict";

import ListController from '../controllers/ListController';
import CrudController from '../controllers/CrudController';

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

/**
 * Class for objects representing a Monad Component. Usually not instantiated
 * directly but rather via `Monad.component`.
 */
export default class Component {

    /**
     * Class constructor.
     *
     * @param string name The name of this component.
     * @param array dependencies Optional array of Angular dependencies.
     * @param function configFn Optional configuration function.
     * @return self
     */
    constructor(name, dependencies = [], configFn = undefined) {
        /**
         * The name of this Component.
         */
        this.name = name;
        /**
         * This Component's Manager.
         */
        this.$manager = undefined;
        /**
         * Optional Angular dependencies.
         */
        this.dependencies = dependencies;
        /**
         * Optional Angular configuration function.
         */
        this.configFn = configFn;
        /**
         * Internally used array of queued actions to perform on bootstrapping.
         */
        this.queued = [];
        /**
         * Boolean indicating if bootstrap has run for this Component.
         */
        this.$bootstrapped = false;
        /**
         * Default settings for this Component.
         */
        this.defaults = angular.extend({}, defaults);
        /**
         * Actual settings for this Component.
         */
        this.settings = {};
        /**
         * Pointer to the actual Angular module.
         */
        this.ngmod = undefined;

        for (let prop in interfacer) {
            if (typeof interfacer[prop] == 'function') {
                /**
                 * Proxy all Angular methods on angular.module.
                 */
                this[prop] = (...args) => {
                    this.queued.push([prop].concat(args));
                    return this;
                };
            }
        }
    }

    /**
     * Bootstrap this component. Usually called automatically.
     *
     * @return void
     */
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

    /**
     * Let this Component extend other Components.
     *
     * When extending, all properties from Components extended upon are merged
     * into the current Component, unless it specifies an override.
     *
     * @param string|Component component, ... One or more components to extend.
     *  Components can be specified either by their name, or as a Component
     *  object. Components _must_ already exist.
     * @return self
     */
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
    
    /**
     * Specify a custom authentication handler for this Component.
     *
     * @param mixed auth An authentication class.
     * @return self
     */
    authentication(auth) {
        this.defaults = merge(this.defaults, {
            list: {resolve: {Authentication: auth}},
            create: {resolve: {Authentication: auth}},
            update: {resolve: {Authentication: auth}}
        });
        return this;
    }

    /**
     * Register a `list` action for this Component.
     *
     * @param string url The URL. `:language` is automatically prepended.
     * @param object options Optional options object.
     * @param object resolve Optional resolve object.
     * @return self
     */
    list(url, options = {}, resolve = {}) {
        options.templateUrl = options.templateUrl || this.name + '/list.html';
        // It's easier if we can specify 'columns' on the options:
        if ('columns' in options) {
            let columns = options.columns;
            resolve.columns = () => columns;
            delete options.columns;
        }

        this.settings.list = {url, options, resolve};
        this.queued.push([addTarget, 'list']);
        return this;
    }

    /**
     * Register a `create` action for this Component.
     *
     * @param string url The URL. `:language` is automatically prepended.
     * @param object options Optional options object.
     * @param object resolve Optional resolve object.
     * @return self
     */
    create(url, options = {}, resolve = {}) {
        options.templateUrl = options.templateUrl || this.name + '/schema.html';
        delete options.create;
        this.settings.create = {url, options, resolve};
        this.queued.push([addTarget, 'create']);
        return this;
    }

    /**
     * Register an `update` action for this Component. The optional `create`
     * option can specifcy a create-URL as a shorthand (typically create and
     * update will be more or less the same).
     *
     * @param string url The URL. `:language` is automatically prepended.
     * @param object options Optional options object.
     * @param object resolve Optional resolve object.
     * @return self
     */
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

    /**
     * Register the Manager class for this Component.
     *
     * @param mixed Manager The Manager class to use.
     */
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
    settings.resolve.component = () => this;
    if ('$mapping' in settings.resolve) {
        let $mapping = angular.copy(settings.resolve.$mapping);
        settings.resolve.$mapping = () => $mapping;
    }
    if (type == 'create') {
        settings.resolve.item = [this.$manager.name, Manager => new Manager.constructor.Model];
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

