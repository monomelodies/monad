
"use strict";

class Model {

    constructor() {
        this.$data = {};
        this.$fields = [];
        this.$deleted = false;
    }

    $load(data = {}, recursive = true) {
        this.$initial = data;
        for (let key in data) {
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
            this.$fields.push(key);
        }
        return this;
    }

    $update() {
        for (let field in this) {
            if (typeof this[field] == 'object' && this[field] != null) {
                if ('$update' in this[field] && this[field].$dirty) {
                    this[field].$update();
                } else if ('$delete' in this[field] && this[field].$deleted) {
                    this[field].$delete();
                } else if ('map' in this[field]) {
                    this[field].map(item => {
                        if (typeof item == 'object') {
                            if ('$update' in item && item.$dirty) {
                                item.$update();
                            } else if ('$delete' in item && item.$deleted) {
                                item.$delete();
                            }
                        }
                    });
                }
            }
        }
    }

    get $new() {
        return !('id' in this.$data && this.$data.id);
    }

    get $dirty() {
        let dirty = false;
        for (let key in this) {
            if (key.substring(0, 1) == '$') {
                continue;
            }
            if (key in this.$data && this.$data[key] != this.$initial[key]) {
                return true;
            } else if (typeof this[key] == 'object' && this[key] != null) {
                if ('map' in this[key]) {
                    this[key].map(elem => {
                        if (typeof elem == 'object' && elem.$dirty) {
                            dirty = true;
                        }
                    });
                } else if (this[key].$dirty) {
                    return true;
                }
            }
        }
        return dirty;
    }

    $pluralize(field) {
        field = field.replace(/y$/, 'ie');
        return this[field + 's'];
    }

};

export {Model};

