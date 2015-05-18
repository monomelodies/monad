
"use strict";

import {ListController} from '../controllers/ListController';
import {CrudController} from '../controllers/CrudController';

let registeredModules = {};

class Module {

    constructor(prefix, ngmod) {
        registeredModules[ngmod.name] = ngmod;
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
        resolve.Manager = resolve.Manager || [normalize(this.prefix, name) + 'Manager', Manager => Manager];
        addTarget(this.name, url, options, resolve);
        return this;
    }

    create(url, options = {}, resolve = {}) {
        // This is basically the same, but with a different URL and possible
        // (usually) perhaps less resolves (i.e. because we don't have a foreign
        // key yet to link stuff to).
        this.update(url, options, resolve);
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
        resolve.Manager = resolve.Manager || [normalize(this.prefix, name) + 'Manager', Manager => Manager];
        addTarget(this.name, url, options, resolve);
        return this;
    }

    manager(Manager) {
        this.service(normalize(this.prefix, this.name) + 'Manager', Manager);
        return this;
    }

    /**
     * Interface to ngModule:
     * {{{
     */
    provider(...args) {
        registeredModules[this.name].provider(...args);
        return this;
    }

    factory(...args) {
        registeredModules[this.name].factory(...args);
        return this;
    }

    service(...args) {
        registeredModules[this.name].service(...args);
        return this;
    }

    value(...args) {
        registeredModules[this.name].value(...args);
        return this;
    }

    constant(...args) {
        registeredModules[this.name].constant(...args);
        return this;
    }

    animation(...args) {
        registeredModules[this.name].animation(...args);
        return this;
    }

    filter(...args) {
        registeredModules[this.name].filter(...args);
        return this;
    }

    controller(...args) {
        registeredModules[this.name].controller(...args);
        return this;
    }

    directive(...args) {
        registeredModules[this.name].directive(...args);
        return this;
    }

    config(...args) {
        registeredModules[this.name].config(...args);
        return this;
    }

    run(...args) {
        registeredModules[this.name].run(...args);
        return this;
    }
    /** }}} */

};

/**
 * Private helper-functions:
 * {{{
 */
function addTarget(name, url, options = {}, resolve = {}) {
    resolve.module = resolve.module || () => this.name;
    let then = {options, resolve};
    registeredModules[name].config(['$routeProvider', $routeProvider => $routeProvider.when('/:language' + url, then)]);
};

function normalize(prefix, name) {
    return prefix + name.substring(0, 1).toUpperCase() + name.substring(1);
};
/** }}} */
console.log('exporting?');

export {Module};

