
"use strict";

class Model {

    constructor() {
    }

    $load(data = {}) {
        this.$data = {};
        this.$fields = [];
        let hasFieldsets = '$fieldsets' in this;
        for (let key in data) {
            var props = {};
            if (!this.hasOwnProperty(key)) {
                props.get = () => {
                    return this.$data[key];
                };
                props.set = value => {
                    this.$data[key] = value;
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

};

export {Model};

