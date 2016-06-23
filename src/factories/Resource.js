
"use strict";

const wm = new WeakMap();

/**
 * Extend default $resource service so it returns more intelligent resource
 * objects, e.g. with dirty checking.
 * In Monad, we want to be able to easily append a new item to an array of
 * queried resources. This exposes a `save` method on the array.
 */
export default ['$resource', '$rootScope', ($resource, $rootScope) => {
    return (url, paramDefaults = {}, actions = {}, options = {}) => {
        let res = $resource(url, paramDefaults, actions, options);

        /**
         * Helper method to quickly (un)set bitflags on a model.
         *
         * @param string source The name of the bitflag field. This should of
         *  course contain an integer.
         * @param object mapping A hash mapping names to flags, e.g. {on: 1}.
         *  From then on you can say `if (obj.on) { ... }` and `obj.on = false`.
         */
        res.prototype.setBitflags = function (source, mapping = {}) {
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
        };

        Object.defineProperty(res.prototype, '$dirty', {
            /**
             * Virtual property to check if res model is "dirty".
             *
             * @return boolean True if dirty, false if pristine.
             */
            get: function () {
                if (wm.get(this).deleted) {
                    return true;
                }
                let initial = wm.get(this).initial || {};
                for (let prop in this) {
                    if (prop.substring(0, 1) == '$' || typeof this[prop] == 'function') {
                        continue;
                    }
                    if (differs(res, this[prop], initial[prop])) {
                        return true;
                    }
                }
                return false;
            }
        });

        Object.defineProperty(res.prototype, '$title', {
            /**
             * Guesstimate the "title" of a particular model instance.
             *
             * @return string A guesstimated title.
             */
            get: function () {
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
                    if (typeof this[prop] == 'string' && this[prop].length && res[prop].length <= 255) {
                        return this[prop];
                    }
                }
                return '[Untitled]';
            }
        });

        Object.defineProperty(res.prototype, '$deleted', {
            /**
             * Get private deleted state.
             *
             * @return bool
             */
            get: function () {
                return wm.get(this).deleted;
            },
            /**
             * Set the deleted state. Note that res does _not_ call the "$delete"
             * resource method.
             *
             * @param mixed value Truthy for "scheduled for deletion".
             */
            set: function (value) {
                wm.get(this).deleted = !!value;
            }
        });

        let query = res.query;
        let get = res.get;
        res.query = (parameters, success, error) => {
            let found = query.call(res, parameters, success, error);
            found.$promise.then(() => {
                found.map(item => {
                    wm.set(item, {initial: copy(item), deleted: false});
                });
                return found;
            });
            found.append = function (obj) {
                found.push(new res(obj));
            };

            found.progress = undefined;
            function done() {
                found.progress--;
                if (found.progress == 0) {
                    $rootScope.$emit('moListSaved');
                }
            };
            found.$save = function () {
                found.promises = [];
                for (let i = 0; i < this.length; i++) {
                    if (angular.isArray(this[i]) && '$save' in this[i] && this[i].$dirty) {
                        this[i].$save();
                        continue;
                    }
                    if (this[i].$deleted) {
                        found.promises.push(this[i].$delete(done));
                    } else if (this[i].$dirty) {
                        found.promises.push(this[i].$save(done));
                    }
                }
                found.progress = found.promises.length;
            };
            Object.defineProperty(found, '$dirty', {
                get: function () {
                    for (let i = 0; i < this.length; i++) {
                        if (this[i].$dirty) {
                            return true;
                        }
                    }
                    return false;
                }
            });
            return found;
        };
        res.get = (parameters, success, error) => {
            let resource = get.call(res, parameters, success, error);
            wm.set(resource, {initial: undefined, deleted: false});
            resource.$promise.then(() => {
                wm.get(resource).initial = copy(resource);
            });
            return resource;
        };
        return res;
    };
}];

/**
 * Private helper to copy a resource, values only.
 *
 * @param Resource resource An Angular resource instance to copy (or anything
 *  else, really - it just copies objects excluding properties starting with $
 *  (special in Angular) and methods.
 */
function copy(resource) {
    let copied = angular.copy(resource);
    let store = {};
    for (let i in copied) {
        if (i.substring(0, 1) != '$' && typeof copied[i] != 'function') {
            store[i] = copied[i];
        }
    }
    return store;
}

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
 * @param Resource comp Resource to check type against.
 * @param mixed a Value to check.
 * @param mixed b Value to compare to.
 * @return bool
 */
function differs(comp, a, b) {
    if ((!isset(a) && isset(b)) || (isset(a) && !isset(b))) {
        return true;
    }
    if (!a && !b) {
        return false;
    }
    // If `a` is "dirty" we don't even have to do any other checks.
    if (a instanceof comp) {
        return a.$dirty || a.$deleted;
    }
    if (angular.isArray(a) && angular.isArray(b)) {
        if (a.length != b.length) {
            return true;
        }
        for (let i = 0; i < a.length; i++) {
            if (differs(comp, a[i], b[i])) {
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
            if (differs(comp, a[i], b[i])) {
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

