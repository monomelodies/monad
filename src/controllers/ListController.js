
"use strict";

import {CrudController} from './CrudController';

class ListController extends CrudController {

    constructor(...args) {
        super(...args);
        this.items = [];
        this.page(args[1]);
    }

    page(params) {
        while (this.items.length) {
            this.items.pop();
        }
        this.Manager.list(params).success(items => items.map(item => this.items.push(item)));
    }

};

export {ListController};

