
"use strict";

import {Model} from './Model';

/**
 * Private method to do a simple check on the nature of an object.
 */
function isModel(obj) {
    return '$data' in obj && '$fields' in obj && '$deleted' in obj && '$new' in obj;
};

class Collection {

    constructor() {
        this.model = Model;
        this.storage = [];
    }

    push(value) {
        let idx = this.storage.length;
        value = isModel(value) ? value : (new this.model()).$create(value);
        this.storage.push(value);
        Object.defineProperty(this, idx, {get: () => this.storage[idx] || undefined, configurable: true});
        return this.length;
    }

    shift() {
        let shifted = this.storage(shift);
        if (shifted !== undefined) {
            delete this[this.storage.length];
        }
        return shifted;
    }

    unshift(...args) {
        args.map(arg => isModel(arg) ? arg : (new this.model()).$create(args));
        let work = new Array(this.storage);
        work.unshift(...args);
        this.storage = [];
        work.map(item => this.push(item));
        return this.length;
    }

    pop() {
        let popped = this.storage.pop();
        if (popped !== undefined) {
            delete this[this.storage.length];
        }
        return popped;
    }

    get length() {
        return this.storage.length;
    }

    reverse() {
        this.storage.reverse();
    }

    sort(...args) {
        this.storage.sort(...args);
        return this;
    }

    splice(start, deleteCount, ...args) {
        args.map(arg => isModel(arg) ? arg : (new this.model()).$create(args));
        let work = new Array(this.storage);
        let retval = work.splice(start, deleteCount, ...args);
        this.storage = [];
        work.map(item => this.push(item));
        return retval;
    }

};

export {Collection};

