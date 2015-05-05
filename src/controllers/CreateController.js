
"use strict";

import {DataController} from './DataController';

class CreateController extends DataController {

    constructor(...args) {
        super(args);
        this.item = this.manager.constructor.Model;
    }

    create(item) {
        let result;
        if (result = this.manager.create(item)) {
            result.success(this.reload);
        }
    }

};

export {CreateController};

