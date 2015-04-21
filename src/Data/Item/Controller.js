
"use strict";

import {Controller as Base} from '../Controller';

class Controller extends Base {

    constructor(...args) {
        super(...args);
//        this.Repository.find(args[1]).success(item => {
//            this.item = this.instantiate(this.Model).$load(item);
//        });
    }

    update() {
        this.Repository.update(this.item).success(this.reload);
    }

};

export {Controller};

