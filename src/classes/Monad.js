
"use strict";

import {Component} from './Component';

let ngmod;

class Monad {

    application(prefix, deps = [], configFn = undefined) {
        if (ngmod != undefined) {
            throw "Sorry, you can only call `monad.application` once!";
        }
        let extra = ['monad.core'];
        for (let mod in Component.all()) {
            extra.push(mod);
        }
        return (ngmod = new Component(prefix, angular.module('monad', deps.concat(extra), configFn)));
    }

    component(prefix, name, deps = [], configFn = undefined) {
        try {
            let existing = Component.get(name);
            return existing;
        } catch (e) {
        }
        return new Component(prefix, angular.module(name, deps.concat(['monad.core']), configFn));
    }
};

export {Monad};

