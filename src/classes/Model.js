
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
        this.$initial = undefined;
        /**
         * Internal data storage for this model.
         */
        this.$data = {};
        /**
         * Set to true if the model is scheduled for deletion.
         */
        this.$deleted = false;
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
        instance.$initial = undefined;
        return instance;
    }

    /**
     * Load data into this model instance.
     *
     * @param object data Hash of key/value pairs of data.
     * @return self
     */
    $load(data = {}) {
        this.$initial = data;
        for (let key in data) {
            let checkDate = isDateTime.exec(data[key]);
            if (!checkDate) {
                checkDate = isDate.exec(data[key]);
            }
            if (checkDate) {
                checkDate.shift();
                data[key] = new Date(...checkDate);
            }
            var props = {enumerable: true, configurable: true};
            if (!this.hasOwnProperty(key)) {
                props.get = () => {
                    return this.$data[key];
                };
                props.set = value => {
                    this.$data[key] = value;
                };
            }
            Object.defineProperty(this, key, props);
            this.$data[key] = data[key];
        }
        return this;
    }

    /**
     * Virtual property to check if this model is "new".
     *
     * @return boolean True if new, false if existing.
     */
    get $new() {
        return this.$initial === undefined;
    }

    /**
     * Virtual property to check if this model is "dirty".
     *
     * @return boolean True if dirty, false if pristine.
     */
    get $dirty() {
        if (this.$deleted) {
            return true;
        }
        if (this.$new) {
            return false;
        }
        for (let key in this) {
            if (key.substring(0, 1) == '$') {
                continue;
            }
            if (key in this.$data && this.$data[key] != this.$initial[key]) {
                return true;
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

};

