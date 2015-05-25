
"use strict";

import {Component} from './Component';

let application;
let registeredComponents = {};

class Monad {

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

    bootstrap() {
        for (let name in registeredComponents) {
            registeredComponents[name].bootstrap();
        }
        application.bootstrap();
    }

};

export {Monad};

