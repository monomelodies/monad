
"use strict";

import {DataController} from './DataController';

class UpdateController extends DataController {

    constructor($routeParams, ...args) {
        super(...args);
        this.manager.find($routeParams).success(item => this.item = item);
    }
    
    update(item) {
        let result;
        if (result = this.manager.update(item)) {
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

UpdateController.$inject = ['$routeParams'].concat(DataController.$inject);

export {UpdateController};

