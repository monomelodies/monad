
"use strict";

import Model from './Model';

/**
 * Private method to do a simple check on the nature of an object.
 */
function isModel(obj) {
    return typeof obj == 'object' && obj instanceof Model;
};

/**
 * An array-like collection class, providing additional functionality for use
 * with models.
 *
 * <code>
 * "use strict";
 *
 * import Collection from '/path/to/monad/src/classes/Collection';
 *
 * class CustomCollection extends Collection {
 *
 *     constructor(...args) {
 *         super();
 *         // do your custom stuff here
 *     }
 *
 *     defaults(obj) {
 *         // augment obj (a model or plain object hash of new data) with
 *         // defaults needed on this Collection.
 *         return obj;
 *     }
 *
 * };
 * </code>
 *
 * The Collection object is meant to provide additional functionality for lists
 * of Models. This mostly comes in handy when dealing with models linked by
 * foreign keys.
 */
export default class Collection {

    /**
     * Class constructor.
     */
    constructor() {
        /**
         * A reference to the base model. Override in derived class if you need
         * to use custom models.
         */
        this.model = Model;
        /**
         * Internal storage.
         */
        this.storage = [];
    }

    /**
     * Overridable helper setting defaults for items in this collection.
     *
     * @param object An object in a collection (typically a model).
     * @return object The augmented object.
     */
    defaults(obj) {
        return obj;
    }

    /**
     * Interface to `Array.push`.
     *
     * @param mixed arg, ... Items to push onto the Collection.
     * @return integer The new length of the Collection.
     */
    push(...args) {
        let idx = this.storage.length;
        args = args.map(arg => this.defaults(arg));
        args = args.map(arg => isModel(arg) ? arg : Model.$create(arg, this.model));
        this.storage.push(...args);
        for (let i = idx; i < this.storage.length; i++) {
            Object.defineProperty(this, i, {get: () => this.storage[i] || undefined, configurable: true});
        }
        return this.length;
    }

    /**
     * Interface to `Array.shift`.
     *
     * @return mixed The shifted element.
     */
    shift() {
        let shifted = this.storage(shift);
        if (shifted !== undefined) {
            delete this[this.storage.length];
        }
        return shifted;
    }

    /**
     * Interface to `Array.unshift`.
     *
     * @param mixed arg, ... Items to unshift into the Collection.
     * @return integer The new length of the Collection.
     */
    unshift(...args) {
        args = args.map(arg => this.defaults(arg));
        args = args.map(arg => isModel(arg) ? arg : Model.$create(arg, this.model));
        let work = new Array(this.storage);
        work.unshift(...args);
        this.storage = [];
        work.map(item => this.push(item));
        return this.length;
    }

    /**
     * Interface to `Array.pop`.
     *
     * @return mixed The popped element.
     */
    pop() {
        let popped = this.storage.pop();
        if (popped !== undefined) {
            delete this[this.storage.length];
        }
        return popped;
    }

    /**
     * Virtual property to get the current size of the Collection.
     *
     * @return integer The current length of the Collection.
     */
    get length() {
        return this.storage.length;
    }

    /**
     * Interface to `Array.reverse`. Reverses the Collection in-place.
     *
     * @return void
     */
    reverse() {
        this.storage.reverse();
    }

    /**
     * Interface to `Array.sort`. Sorts the Collection in-place.
     *
     * @param mixed arg, ... Whatever you want to sort with.
     * @return self
     */
    sort(...args) {
        this.storage.sort(...args);
        return this;
    }

    /**
     * Interface to `Array.splice`.
     *
     * @param integer start Index to start splicing at.
     * @param integer deleteCount Number of items to delete.
     * @param mixed arg, ... Stuff to be reinserted.
     * @return array Array of spliced items.
     */
    splice(start, deleteCount, ...args) {
        args = args.map(arg => this.defaults(arg));
        let previousLength = this.length;
        let work = new Array(...this.storage);
        let retval = work.splice(start, deleteCount, ...args);
        this.storage = [];
        work.map(item => this.push(item));
        if (this.length < previousLength) {
            for (let i = this.length; i < previousLength; i++) {
                delete this[i];
            }
        }
        return retval;
    }

    /**
     * Interface to `Array.indexOf`.
     *
     * @param mixed item The item to check the index of.
     * @return integer The index of the item, or -1.
     */
    indexOf(item) {
        return this.storage.indexOf(item);
    }

    /**
     * Interface to `Array.map`.
     *
     * @param mixed arg, ... Whatever you need to pass to `Array.map`.
     * @return array The value of `this.storage` after applying `map`.
     */
    map(...args) {
        return this.storage.map(...args);
    }

    /**
     * Virtual property to check if the entire Collection is "dirty".
     *
     * @return boolean True if at least one item is considered "dirty",
     *  otherwise false.
     */
    get $dirty() {
        for (let i = 0; i < this.storage.length; i++) {
            if (this.storage[i].$new || this.storage[i].$dirty) {
                return true;
            }
        }
        return false;
    }

};

