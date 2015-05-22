
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

    /**
     * Overridable helper setting defaults for items in this collection.
     */
    defaults(obj) {
        return obj;
    }

    push(...args) {
        let idx = this.storage.length;
        args = args.map(arg => this.defaults(arg));
        args = args.map(arg => isModel(arg) ? arg : (new this.model()).$create(arg));
        this.storage.push(...args);
        for (let i = idx; i < this.storage.length; i++) {
            Object.defineProperty(this, i, {get: () => this.storage[i] || undefined, configurable: true});
        }
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
        args = args.map(arg => this.defaults(arg));
        args = args.map(arg => isModel(arg) ? arg : (new this.model()).$create(args));
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
        args = args.map(arg => this.defaults(arg));
        args = args.map(arg => isModel(arg) ? arg : (new this.model()).$create(args));
        let work = new Array(this.storage);
        let retval = work.splice(start, deleteCount, ...args);
        this.storage = [];
        work.map(item => this.push(item));
        return retval;
    }

    indexOf(item) {
        return this.storage.indexOf(item);
    }

    get $dirty() {
        for (let i = 0; i < this.storage.length; i++) {
            if (this.storage[i].$new || this.storage[i].$dirty) {
                return true;
            }
        }
        return false;
    }

};

export {Collection};
