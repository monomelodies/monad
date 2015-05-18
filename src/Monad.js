
"use strict";

import {Module} from './classes/Module';

let ngmod;
let defined = {};

class Monad {

    application(prefix, deps = [], configFn = undefined) {
        if (ngmod == undefined) {
            ngmod = new Module(prefix, angular.module('monad', deps.concat(['monad.core']), configFn));
        } else {
            throw "Sorry, you can only call `monad.application` once!";
        }
        return ngmod;
    }

    module(prefix, name, deps = [], configFn = undefined) {
        if (!defined[name]) {
            defined[name] = new Module(prefix, angular.module(name, deps.concat(['monad'], configFn)));
        }
        return defined[name];
    }
};

export {Monad};

