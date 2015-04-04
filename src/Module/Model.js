
"use strict";

class Model {

    constructor(data = {}) {
        this._data = {};
        for (let key in data) {
            this._data[key] = data[key];
            if (!this.hasOwnProperty(key)) {
                this[key] = data[key];
            }
        }
    }

};

export {Model};

