
"use strict";

import {Component} from './classes/Component';

let ngmod;
let defined = {};

class Monad {

    application(prefix, deps = [], configFn = undefined) {
        if (ngmod == undefined) {
            ngmod = new Component(prefix, angular.module('monad', deps.concat(['monad.core']), configFn));
        } else {
            throw "Sorry, you can only call `monad.application` once!";
        }
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

