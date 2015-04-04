
"use strict";

class Model {

    constructor(data = {}) {
        this._data = new Map();
        for (let key in data) {
            this._data.set(key, data[key]);
            Object.defineProperty(this, key, {
                get: function() {
                    return this._data[key];
                },
                set: function(value) {
                    this._data[key] = value;
                }
            });
        }
    }

};

export {Model};

