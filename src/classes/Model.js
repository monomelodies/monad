
"use strict";

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
let data = new WeakMap();

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
        wm.set(this, {initial: undefined});
        /**
         * Internal data storage for this model.
         */
        wm.set(this, {data: {}});
        /**
         * Set to true if the model is scheduled for deletion.
         */
        wm.set(this, {deleted: false});
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
        wm.set(instance, {initial: undefined});
        return instance;
    }

    /**
     * Load data into this model instance.
     *
     * @param object data Hash of key/value pairs of data.
     * @return self
     */
    $load(data = {}) {
        for (let key in data) {
            this.$addField(key);
            this[key] = data[key];
        }
        wm.set(this, {initial: angular.copy(data)});
        return this;
    }

    /**
     * Method to add a field called key, but only if it doesn't exist
     * natively on the model.
     *
     * @param string key The keyname (property).
     * @return void
     */
    $addField(key) {
        if (!this.hasOwnProperty(key)) {
            var props = {enumerable: true, configurable: true};
            props.get = () => {
                return data.get(this)[key];
            };
            props.set = value => {
                if (value != undefined) {
                    let checkDate = isDateTime.exec(value);
                    if (!checkDate) {
                        checkDate = isDate.exec(value);
                    }
                    if (checkDate) {
                        checkDate.shift();
                        // Javascript months are offset by 0 for reasons only Brendan Eich knows...
                        checkDate[1]--;
                        value = new Date(...checkDate);
                    } else if ((value - 0) == value && ('' + value).trim().length > 0) {
                        value = value - 0;
                    }
                }
                let d = {};
                d[key] = value;
                data.set(this, d);
            };
            Object.defineProperty(this, key, props);
        }
    }

    /**
     * Virtual property to check if this model is "new".
     *
     * @return boolean True if new, false if existing.
     */
    get $new() {
        return wm.get(this).initial === undefined;
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
        for (let key in this) {
            if (key.substring(0, 1) == '$') {
                continue;
            }
            if (!(key in data.get(this))) {
                let value = this[key];
                delete this[key];
                this.$addField(key, value);
            }
            var initial = wm.get(this).initial;
            if (!(initial && ('' + this[key]) == ('' + initial[key]))) {
                if (this[key] !== null && this[key] !== undefined && ('' + this[key]).replace(/\s+/, '').length) {
                    return true;
                }
            } else if (typeof this[key] == 'object' && this[key] != null) {
                if ('map' in this[key]) {
                    let dirty = false;
                    this[key].map(elem => {
                        if (typeof elem == 'object' && elem.$dirty || elem.$deleted) {
                            dirty = true;
                        }
                    });
                    if (dirty) {
                        return true;
                    }
                } else if (this[key].$dirty || this[key].$deleted) {
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
        let d = data.get(this);
        // First, the usual suspects:
        if ('title' in d) {
            return d;
        }
        if ('name' in d) {
            return d.name;
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

