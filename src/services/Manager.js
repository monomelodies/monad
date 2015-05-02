
"use strict";

class Manager {

    constructor() {
    }

    update(model) {
        for (let field in model) {
            if (field.substring(0, 1) == '$') {
                continue;
            }
            if (typeof model[field] == 'object' && model[field] != null) {
                if ('$delete' in model[field] && model[field].$deleted) {
                    model[field].$delete();
                } else if ('$update' in model[field] && model[field].$dirty) {
                    model[field].$update();
                } else if ('map' in model[field]) {
                    model[field].map(item => {
                        if (typeof item == 'object') {
                            if ('$delete' in item && item.$deleted) {
                                item.$delete();
                            } else if ('$update' in item && item.$dirty) {
                                item.$update();
                            }
                        }
                    });
                }
            }
            if (model.$initial[field]) {
                model.$initial[field] = model.$data[field];
            }
        }
    }

};

export {Manager};

