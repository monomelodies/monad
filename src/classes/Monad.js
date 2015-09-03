
"use strict";

import Component from './Component';
import Navigation from '../services/Navigation';

let application = undefined;
let registeredComponents = {};

export default class Monad {

    application(name, deps = [], configFn = undefined) {
        if (application != undefined) {
            throw "Sorry, you can only call `monad.application` once!";
        }
        let extra = ['monad.core'];
        for (let mod in registeredComponents) {
            extra.push(mod);
        }
        this.name = name;
        return (application = new Component(this.name, deps.concat(extra), configFn));
    }

    component(name, deps = [], configFn = undefined) {
        if (!(name in registeredComponents)) {
            registeredComponents[name] = new Component(name, deps.concat(['monad.core']), configFn);
        }
        return registeredComponents[name];
    }

    exists(name) {
        return name in registeredComponents;
    }

    bootstrap() {
        if (application == undefined) {
            throw "Looks like you forget to call monad.application...";
        }
        application.bootstrap();
        angular.bootstrap(document, [this.name]);
    }

    navigation(components, menu = 'main') {
        components.map(component => {
            Navigation.register(component.name, menu, '/:language' + component.settings.list.url);
        });
    }

};

