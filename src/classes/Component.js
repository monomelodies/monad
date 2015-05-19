
"use strict";

import {ListController} from '../controllers/ListController';
import {CrudController} from '../controllers/CrudController';
import {Navigation} from '../services/Navigation';

let registeredComponents = {};
let nav = new Navigation();

class Component {

    constructor(prefix, ngmod) {
        registeredComponents[ngmod.name] = ngmod;
        registeredComponents[ngmod.name].paths = {};
        this.name = ngmod.name;
        this.prefix = prefix;
    }

    list(url, options = {}, resolve = {}) {
        // Defaults for options:
        options.controller = options.controller || ListController;
        // Overriding this is generally a bad idea...
        options.controllerAs = options.controllerAs || 'list';
        options.templateUrl = options.templateUrl || '../monad/templates/list.html';
        delete options.template; // Don't do this.

        // Defaults for resolve:
        resolve.Manager = resolve.Manager || [normalize(this.prefix, this.name) + 'Manager', Manager => Manager];

        // It's easier if we can specify 'columns' on the options:
        if ('columns' in options) {
            let columns = options.columns;
            resolve.columns = () => columns;
            delete options.columns;
        }

        if (!('menu' in options) || options.menu) {
            nav.register(options.menu || 'main', '/:language' + url, 'monad.navigation.' + this.name);
        }
        delete(options.menu);

        addTarget(this.name, url, options, resolve);
        registeredComponents[this.name].paths.list = '/:language' + url;
        return this;
    }

    update(url, options = {}, resolve = {}) {
        // Defaults for options:
        options.controller = options.controller || CrudController;
        // Overriding this is generally a bad idea...
        options.controllerAs = options.controllerAs || 'crud';
        options.templateUrl = options.templateUrl || this.name + '/schema.html';
        delete options.template; // Don't do this.

        // Defaults for resolve:
        resolve.Manager = resolve.Manager || [normalize(this.prefix, this.name) + 'Manager', Manager => Manager];

        addTarget(this.name, url, options, resolve);
        registeredComponents[this.name].paths.update = '/:language' + url;
        return this;
    }

    manager(Manager) {
        this.service(normalize(this.prefix, this.name) + 'Manager', Manager);
        return this;
    }

    static get(name) {
        return registeredComponents[name];
    }

    /**
     * Interface to ngModule:
     * {{{
     */
    provider(...args) {
        registeredComponents[this.name].provider(...args);
        return this;
    }

    factory(...args) {
        registeredComponents[this.name].factory(...args);
        return this;
    }

    service(...args) {
        registeredComponents[this.name].service(...args);
        return this;
    }

    value(...args) {
        registeredComponents[this.name].value(...args);
        return this;
    }

    constant(...args) {
        registeredComponents[this.name].constant(...args);
        return this;
    }

    animation(...args) {
        registeredComponents[this.name].animation(...args);
        return this;
    }

    filter(...args) {
        registeredComponents[this.name].filter(...args);
        return this;
    }

    controller(...args) {
        registeredComponents[this.name].controller(...args);
        return this;
    }

    directive(...args) {
        registeredComponents[this.name].directive(...args);
        return this;
    }

    config(...args) {
        registeredComponents[this.name].config(...args);
        return this;
    }

    run(...args) {
        registeredComponents[this.name].run(...args);
        return this;
    }
    /** }}} */

};

/**
 * Private helper-functions:
 * {{{
 */
function addTarget(name, url, options = {}, resolve = {}) {
    resolve.module = () => name;
    options.resolve = resolve;
    registeredComponents[name].config(['$routeProvider', '$translatePartialLoaderProvider', ($routeProvider, $translatePartialLoaderProvider) => {
        $routeProvider.when('/:language' + url, options);
        $translatePartialLoaderProvider.addPart(name);
    }]);
};

function normalize(prefix, name) {
    return prefix + name.substring(0, 1).toUpperCase() + name.substring(1);
};
/** }}} */

export {Component};

