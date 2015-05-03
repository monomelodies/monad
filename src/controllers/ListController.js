
"use strict";

import {DataController} from './DataController';

class Controller extends DataController {

    constructor(...args) {
        super(...args);
        this.items = [];
        this.page(args[1]);
    }

    page(params) {
        while (this.items.length) {
            this.items.pop();
        }
        this.manager.list(params).success(items => items.map(item => this.items.push(item)));
    }

};

export {Controller};

