
"use strict";

import {Controller as Base} from '../Controller';

class Controller extends Base {

    constructor(...args) {
        super(...args);
        this.Repository.find(args[1]).success(item => {
            this.item = this.instantiate(this.Model).$load(item);
        });
    }

    update(item) {
        let result;
        if (result = this.Repository.update(item)) {
            result.success(this.reload);
        }
    }

    ['delete'](item) {
        // TODO: confirm?
        item.$deleted = true;
        return this.Repository['delete'](item);
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

