
"use strict";

class Repository {

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

    update(model) {
        for (let field in model) {
            if (field.substring(0, 1) == '$') {
                continue;
            }
            if (typeof model[field] == 'object' && model[field] != null) {
                if ('$delete' in model[field] && model[field].$deleted) {
                    model[field].$delete();
                } else if ('$update' in model[field] && model[field].$dirty) {
                    model[field].$update();
                } else if ('map' in model[field]) {
                    model[field].map(item => {
                        if (typeof item == 'object') {
                            if ('$delete' in item && item.$deleted) {
                                item.$delete();
                            } else if ('$update' in item && item.$dirty) {
                                item.$update();
                            }
                        }
                    });
                }
            }
            if (model.$initial[field]) {
                model.$initial[field] = model.$data[field];
            }
        }
    }

    get $new() {
        return !('id' in this.$data && this.$data.id);
    }

    get $dirty() {
        if (this.$deleted) {
            return true;
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

    $pluralize(field) {
        field = field.replace(/y$/, 'ie');
        return this[field + 's'];
    }

    $export() {
        let data = {};
        for (let prop in this) {
            if (prop.substring(0, 1) == '$') {
                continue;
            }
            data[prop] = this[prop];
        }
        return data;
    }

};

export {Repository};

