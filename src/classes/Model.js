
"use strict";

import Collection from './Collection';

let isDateTime = new RegExp(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
let isDate = new RegExp(/^(\d{4})-(\d{2})-(\d{2})/);
let mapper = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12'
};

function map(month) {
    return mapper[month];
};

let wm = new WeakMap();

function isset(val) {
    return val !== undefined && val !== null;
}

/**
 * A data object with dirty checking and optional virtual members or other
 * additional logic. Implementors should generally extend this class, but this
 * is not required.
 */
export default class Model {

    /**
     * Class constructor.
     */
    constructor() {
        /**
         * The "initial" state for this model. Used to check for pristineness.
         * This is automatically set when $load is called.
         */
        wm.set(this, {initial: undefined, deleted: false});
    }

    /**
     * Static method to create a new Model of this type, optionally specifying
     * default data and a class to derive from.
     *
     * @param object data Hash of key/value pairs of data.
     * @param class derivedClass Optional class to actually use when
     *  instantiating (defaults to the current class).
     * @return mixed A new model of the desired class.
     */
    static $create(data = {}, derivedClass = undefined) {
        derivedClass = derivedClass || Model;
        let instance = new derivedClass();
        instance.$load(data);
        wm.set(instance, {initial: undefined, deleted: false});
        return instance;
    }

    /**
     * Load data into this model instance.
     *
     * @param object data Hash of key/value pairs of data.
     * @return self
     */
    $load(data = {}) {
        if (data == undefined) {
            wm.set(this, {initial: undefined, deleted: true});
        } else {
            for (let key in data) {
                this[key] = data[key];
            }
            wm.set(this, {initial: angular.copy(data), deleted: false});
        }
        return this;
    }

    /**
     * Virtual property to check if this model is "new".
     *
     * @return boolean True if new, false if existing.
     */
    get $new() {
        return !isset(wm.get(this).initial);
    }

    /**
     * Virtual property to check if this model is "dirty".
     *
     * @return boolean True if dirty, false if pristine.
     */
    get $dirty() {
        if (wm.get(this).deleted) {
            return true;
        }
        let initial = wm.get(this).initial;
        for (let key in this) {
            if (key.substring(0, 1) == '$') {
                continue;
            }
            if (!isset(this[key]) && !isset(initial)) {
                continue;
            }
            if (!isset(initial) && isset(this[key])) {
                return true;
            }
            if (('' + this[key]).trim() != ('' + initial[key]).trim() && typeof this[key] != 'object') {
                return true;
            }
            if (!this[key] && initial[key] || this[key] && !initial[key]) {
                return true;
            }
            if (typeof this[key] == 'object') {
                if (this[key] instanceof Collection) {
                    let dirty = false;
                    this[key].map(elem => {
                        if (typeof elem == 'object' && elem.$dirty || elem.$deleted) {
                            dirty = true;
                        }
                    });
                    if (dirty) {
                        return true;
                    }
                } else if (this[key] instanceof Model && this[key].$dirty) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Guesstimate the "title" of a particular model instance.
     *
     * @return string A guesstimated title.
     */
    get $title() {
        // First, the usual suspects:
        if ('title' in this) {
            return this.title;
        }
        if ('name' in this) {
            return this.name;
        }
        // If any field is an actual string _and_ its length is shorter
        // than 255 chars (reasonable maximum...) use that:
        for (let prop in this) {
            if (prop.substring(0, 1) == '$') {
                continue;
            }
            if (this[prop] instanceof String
                && this[prop].length
                && this[prop].length <= 255
            ) {
                return this[prop];
            }
        }
        return '[Untitled]';
    }

};

