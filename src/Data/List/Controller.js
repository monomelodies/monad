
"use strict";

import {Controller as Base} from '../Controller';

let route;
let injector;

class Controller extends Base {

    constructor(...args) {
        super(...args);
        this.items = [];
        this.page(args[1]);
        this.item = this.instantiate(this.Model).$load({})
    }

    page(params) {
        while (this.items.length) {
            this.items.pop();
        }
        this.Repository.list(params).success(items => items.map(item => this.items.push(this.instantiate(this.Model).$load(item))));
    }

};

export {Controller};

