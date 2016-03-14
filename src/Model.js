
"use strict";

let wm = new WeakMap();
let promise = new WeakMap();

/**
 * A data object with dirty checking and other virtual helpers.
 */
export default class Model {

    /**
     * Class constructor. Pass the initial key/values as data. This should be
     * an Angular resource object.
     */
    constructor(data = {}) {
        wm.set(this, {initial: undefined, deleted: false});
        let loader = () => {
            wm.get(this).initial = angular.copy(data);
            for (let prop in data) {
                if (prop == '$promise') {
                    continue;
                }
                this[prop] = data[prop];
            }
        };
        if (data.$promise) {
            data.$promise.then(loader);
            Object.defineProperty(this, '$promise', {get: () => data.$promise});
        } else {
            loader();
        }
    }

    setBitflags(source, mapping = {}) {
        for (let name in mapping) {
            Object.defineProperty(this, name, {
                get: () => !!(this[source] & mapping[name]),
                set: value => {
                    if (!!value) {
                        this[source] |= mapping[name];
                    } else {
                        this[source] &= ~mapping[name];
                    }
                }
            });
        }
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
        let initial = wm.get(this).initial || {};
        for (let prop in this) {
            if (prop.substring(0, 1) == '$') {
                continue;
            }
            if (differs(this[prop], initial[prop])) {
                return true;
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
            if (typeof this[prop] == 'string' && this[prop].length && this[prop].length <= 255) {
                return this[prop];
            }
        }
        return '[Untitled]';
    }

    /**
     * Get private deleted state.
     *
     * @return bool
     */
    get $deleted() {
        return wm.get(this).deleted;
    }

    /**
     * Set the deleted state. Note that this does _not_ call the "$delete"
     * resource method.
     *
     * @param mixed value Truthy for "scheduled for deletion".
     */
    set $deleted(value) {
        wm.get(this).deleted = !!value;
    }

};

/**
 * Private helper to check if a field is actually set.
 * Unset is defined as undefined or null, string with no length OR
 * a string consisting only of <p></p> (for WYSIWTYG fields).
 *
 * @param mixed val The value to check.
 * @return bool True if the value is considered "empty", else false.
 */
function isset(val) {
    return !!(val !== undefined && val !== null && ('' + val).trim().length && !('' + val).trim().match(/^<p>(\s|\n|&nbsp;)*<\/p>$/));
}

/**
 * Private helper to determine if two values differ. Values can be of any type;
 * the helper guesstimates and recurses as needed.
 *
 * @param mixed a Value to check.
 * @param mixed b Value to compare to.
 * @return bool
 */
function differs(a, b) {
    if ((!isset(a) && isset(b)) || (isset(a) && !isset(b))) {
        return true;
    }
    if (!a && !b) {
        return false;
    }
    // If `a` is "dirty" we don't even have to do any other checks.
    if (a instanceof Model) {
        return a.$dirty || a.$deleted;
    }
    if (angular.isArray(a) && angular.isArray(b)) {
        if (a.length != b.length) {
            return true;
        }
        for (let i = 0; i < a.length; i++) {
            if (differs(a[i], b[i])) {
                return true;
            }
        }
    }
    if ((a instanceof Date) && (b instanceof Date)) {
        return a < b || a > b;
    }
    if (typeof a == 'object' && typeof b == 'object') {
        for (let i in a) {
            if (i.substring(0, 1) == '$') {
                continue;
            }
            if (differs(a[i], b[i])) {
                return true;
            }
        }
        for (let i in b) {
            if (i.substring(0, 1) == '$') {
                continue;
            }
            if (!(i in a)) {
                return true;
            }
        }
        return false;
    }
    return ('' + a).trim() != ('' + b).trim();
}

