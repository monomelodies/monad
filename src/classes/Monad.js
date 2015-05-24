
"use strict";

import {Component} from './Component';

let ngmod;
let defined = {};

class Monad {

    application(prefix, deps = [], configFn = undefined) {
        if (ngmod != undefined) {
            throw "Sorry, you can only call `monad.application` once!";
        }
        let extra = ['monad.core'];
        for (let mod in defined) {
            extra.push(mod);
        }
        return (ngmod = new Component(prefix, angular.module('monad', deps.concat(extra), configFn)));
        return ngmod;
    }

    component(prefix, name, deps = [], configFn = undefined) {
        if (!defined[name]) {
            defined[name] = new Component(prefix, angular.module(name, deps.concat(['monad.core']), configFn));
        }
        return defined[name];
    }
};

export {Monad};

