
"use strict";

import {ListController} from '../controllers/ListController';
import {CrudController} from '../controllers/CrudController';
import {Navigation} from '../services/Navigation';

let nav = new Navigation();

class Component {

    constructor(ngmod) {
        this.paths = {};
        this.ngmod = ngmod;
        this.name = ngmod.name;
    }

    list(url, options = {}, resolve = {}) {
        // Defaults for options:
        options.controller = options.controller || ListController;
        // Overriding this is generally a bad idea...
        options.controllerAs = options.controllerAs || 'list';
        options.templateUrl = options.templateUrl || '../monad/templates/list.html';
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

        addTarget.call(this, url, options, resolve);
        this.paths.list = '/:language' + url;
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
        resolve.Manager = resolve.Manager || [normalize(this.name) + 'Manager', Manager => Manager];

        addTarget.call(this, url, options, resolve);
        this.paths.update = '/:language' + url;
        return this;
    }

    manager(Manager) {
        this.service(this.name + 'Manager', Manager);
        return this;
    }

    /**
     * Interface to ngModule:
     * {{{
     */
    provider(...args) {
        this.ngmod.provider(...args);
        return this;
    }

    factory(...args) {
        this.ngmod.factory(...args);
        return this;
    }

    service(...args) {
        this.ngmod.service(...args);
        return this;
    }

    value(...args) {
        this.ngmod.value(...args);
        return this;
    }

    constant(...args) {
        this.ngmod.constant(...args);
        return this;
    }

    animation(...args) {
        this.ngmod.animation(...args);
        return this;
    }

    filter(...args) {
        this.ngmod.filter(...args);
        return this;
    }

    controller(...args) {
        this.ngmod.controller(...args);
        return this;
    }

    directive(...args) {
        this.ngmod.directive(...args);
        return this;
    }

    config(...args) {
        this.ngmod.config(...args);
        return this;
    }

    run(...args) {
        this.ngmod.run(...args);
        return this;
    }
    /** }}} */

};

/**
 * Private helper-functions:
 * {{{
 */
function addTarget(url, options = {}, resolve = {}) {
    resolve.module = () => this.name;
    options.resolve = resolve;
    this.ngmod.config(['$routeProvider', '$translatePartialLoaderProvider', ($routeProvider, $translatePartialLoaderProvider) => {
        $routeProvider.when('/:language' + url, options);
        $translatePartialLoaderProvider.addPart(this.name);
    }]);
};

function normalize(name, replace = undefined) {
    if (replace == undefined) {
        replace = match => match.substring(1).toUpperCase();
    }
    return name.replace(/\/(\w)/g, replace);
};
/** }}} */

export {Component};

