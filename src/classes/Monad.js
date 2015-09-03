
"use strict";

import Component from './Component';

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
        return (application = new Component('monad', deps.concat(extra), configFn));
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
    }

};

