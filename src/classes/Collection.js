
"use strict";

import {Model} from './Model';

class Collection {

    constructor() {
        this.model = Model;
        this.storage = [];
    }

    push(value) {
        let idx = this.storage.length;
        this.storage.push((new this.model()).$create(value));
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

    splice(...args) {
        let work = new Array(this.storage);
        let retval = work.splice(...args);
        this.storage = [];
        work.map(item => this.push(item));
        return retval;
    }

};

export {Collection};

