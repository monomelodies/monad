
"use strict";

import Component from './Component';
import Navigation from '../services/Navigation';

let application = undefined;
let registeredComponents = {};

/**
 * The `Monad` class is instantiated as the `window.monad` global object. You
 * should use this instead of `window.angular` for application creation and
 * Component definition.
 *
 * In ES6 code, you'll usually do something like this:
 * <code>
 * import monad from '/path/to/monad/src/angular';
 * </code>
 */
export default class Monad {

    /**
     * Register an application with optional dependencies and configFn. This
     * sould be called _after_ all components have been declared.
     *
     * @param string name The name for this application.
     * @param array deps Optional array of Angular dependencies.
     * @param function configFn Optional configuration function.
     * @return Component A Component object representing your application.
     */
    application(name, deps = [], configFn = undefined) {
        if (application != undefined) {
            throw "Sorry, you can only call `monad.application` once!";
        }
        let extra = ['monad.core'];
        for (let mod in registeredComponents) {
            extra.push(mod);
        }
        /**
         * The name of this application.
         */
        this.name = name;
        return (application = new Component(this.name, deps.concat(extra), configFn));
    }

    /**
     * Register a Component for the current application.
     *
     * @param string name The Component's name.
     * @param array deps Optional array of Angular dependencies.
     * @param function configFn Optional configuration function.
     * @return Component A Component object. If a Component by that name already
     *  exists, the exisiting one is returned.
     */
    component(name, deps = [], configFn = undefined) {
        if (!(name in registeredComponents)) {
            registeredComponents[name] = new Component(name, deps.concat(['monad.core']), configFn);
        }
        return registeredComponents[name];
    }

    /**
     * Check if a Component exists.
     *
     * @param string name The Component name to check for.
     * @return boolean True if the Component exists, else false.
     */
    exists(name) {
        return name in registeredComponents;
    }

    /**
     * Bootstrap the Monad admin application. The default `index.html` calls
     * this automatically.
     *
     * @return void
     */
    bootstrap() {
        if (application == undefined) {
            throw "Looks like you forget to call monad.application...";
        }
        application.bootstrap();
        angular.bootstrap(document, [this.name]);
    }

    /**
     * Add Components to a navigation section.
     *
     * @param array components The Component objects to add.
     * @param string menu Optional menu name to add to. Defaults to `main`.
     * @return void
     */
    navigation(components, menu = 'main') {
        components.map(component => {
            Navigation.register(component.name, menu, '/:language' + component.settings.list.url);
        });
    }

};

