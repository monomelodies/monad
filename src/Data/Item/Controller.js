
"use strict";

import {Controller as Base} from '../Controller';

class Controller extends Base {

    constructor(...args) {
        super(...args);
        this.Repository.find(args[1]).success(item => {
            this.item = this.Model.$load(item);
        });
    }

    update() {
        this.Repository.update(this.item).success(this.reload);
    }

    templateFor(field) {
        let t;
        this.Schema.fields.map(f => {
            if (f.key == field) {
                t = f.widget;
            }
        });
        return t;
    }

};

export {Controller};

