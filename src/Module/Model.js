
"use strict";

class Model {

    constructor() {
    }

    $load(data = {}) {
        this.$data = {};
        this.$initial = data;
        this.$fields = [];
        this.$dirty = false;
        for (let key in data) {
            var props = {};
            if (!this.hasOwnProperty(key)) {
                props.get = () => {
                    return this.$data[key];
                };
                props.set = value => {
                    this.$data[key] = value;
                    this.$dirty = false;
                    for (let key in this.$data) {
                        if (this.$data[key] != this.$initial[key]) {
                            this.$dirty = true;
                        }
                    }
                };
                Object.defineProperty(this, key, props);
            }
            this.$data[key] = data[key];
            this.$fields.push(key);
        }
    }

    $new() {
        return !('id' in this.$data && this.$data.id);
    }

    $pluralize(field) {
        field = field.replace(/y$/, 'ie');
        return this[field + 's'];
    }

};

export {Model};

