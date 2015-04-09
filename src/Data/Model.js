
"use strict";

class Model {

    constructor() {
    }

    $load(data = {}) {
        this.$data = {};
        this.$initial = data;
        this.$fields = [];
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

    get $new() {
        return !('id' in this.$data && this.$data.id);
    }

    get $dirty() {
        for (let key in this.$data) {
            if (this.$data[key] != this.$initial[key]) {
                return true;
            }
        }
        return false;
    }

    $pluralize(field) {
        field = field.replace(/y$/, 'ie');
        return this[field + 's'];
    }

};

export {Model};

