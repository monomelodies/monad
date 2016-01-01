
"use strict";

import Model from './Model';

let wm = new WeakMap();
let promise = new WeakMap();

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
    constructor(p = undefined) {
        /**
         * Internal storage.
         */
        wm.set(this, []);
        if (p) {
            p.then(results => results.data.map(value => {
                let model = new this.constructor.Model();
                model.$load(value);
                this.push(model);
            }));
            promise.set(this, p);
        }
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
     * Adds a new entry to this collection of the specified type.
     */
    append() {
        this.push(this.defaults(this.constructor.Model.$create({})));
    }

    /**
     * Interface to `Array.push`.
     *
     * @param mixed arg, ... Items to push onto the Collection.
     * @return integer The new length of the Collection.
     */
    push(...args) {
        let idx = wm.get(this).length;
        args = args.map(arg => this.defaults(arg));
        args = args.map(arg => isModel(arg) ? arg : Model.$create(arg, this.constructor.Model));
        let storage = wm.get(this);
        storage.push(...args);
        for (let i = idx; i < wm.get(this).length; i++) {
            Object.defineProperty(this, i, {get: () => wm.get(this)[i] || undefined, configurable: true});
        }
        return this.length;
    }

    /**
     * Interface to `Array.shift`.
     *
     * @return mixed The shifted element.
     */
    shift() {
        let shifted = wm.get(this).shift();
        if (shifted !== undefined) {
            delete this[wm.get(this)];
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
        args = args.map(arg => isModel(arg) ? arg : Model.$create(arg, this.constructor.Model));
        let work = new Array(wm.get(this));
        work.unshift(...args);
        wm.set(this, []);
        work.map(item => this.push(item));
        return this.length;
    }

    /**
     * Interface to `Array.pop`.
     *
     * @return mixed The popped element.
     */
    pop() {
        let popped = wm.get(this).pop();
        if (popped !== undefined) {
            delete this[wm.get(this).length];
        }
        return popped;
    }

    /**
     * Virtual property to get the current size of the Collection.
     *
     * @return integer The current length of the Collection.
     */
    get length() {
        return wm.get(this).length;
    }

    /**
     * Interface to `Array.reverse`. Reverses the Collection in-place.
     *
     * @return void
     */
    reverse() {
        wm.get(this, wm.get(this).reverse());
    }

    /**
     * Interface to `Array.sort`. Sorts the Collection in-place.
     *
     * @param mixed arg, ... Whatever you want to sort with.
     * @return self
     */
    sort(...args) {
        wm.set(this, wm.get(this).sort(...args));
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
        let previousLength = this.length;
        let work = new Array(...wm.get(this));
        let retval = work.splice(start, deleteCount, ...args);
        wm.set(this, []);
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
        return wm.get(this).indexOf(item);
    }

    /**
     * Interface to `Array.map`.
     *
     * @param mixed arg, ... Whatever you need to pass to `Array.map`.
     * @return array The value of the internal storage after applying `map`.
     */
    map(...args) {
        return wm.get(this).map(...args);
    }

    /**
     * Virtual property to check if the entire Collection is "dirty".
     *
     * @return boolean True if at least one item is considered "dirty",
     *  otherwise false.
     */
    get $dirty() {
        for (let i = 0; i < wm.get(this).length; i++) {
            if (this[i].$new || this[i].$dirty) {
                return true;
            }
        }
        return false;
    }

    get $promise() {
        return promise.get(this);
    }

};

/**
 * A reference to the base model. Override in derived class if you need
 * to use custom models.
 */
Collection.Model = Model;

