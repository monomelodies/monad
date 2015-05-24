
"use strict";

import {Model} from '../classes/Model';
import {Collection} from '../classes/Collection';

let http;
let cache;

function appendTransform(transform) {
    let defaults = http.defaults.transformResponse;
    defaults = angular.isArray(defaults) ? defaults : [defaults];
    return defaults.concat(transform);
};

class Manager {

    constructor($http, $cacheFactory) {
        http = $http;
        cache = $cacheFactory('monad-managers');
        // Set this per-manager where needed:
        this.model = Model;
        this.collection = new Collection();
    }

    get count() {
        return 0;
    }

    list(url) {
        return http({
            url,
            method: 'GET',
            transformResponse: appendTransform(values => {
                while (this.collection.length) {
                    this.collection.pop();
                }
                values.map(value => this.collection.push((new this.model()).$load(value)));
                return this.collection;
            }),
            cache
        });
    }

    find(url) {
        return http({
            url,
            method: 'GET',
            transformResponse: appendTransform(item => (new this.model()).$load(item)),
            cache
        });
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

    get http() {
        return http;
    }

};

Manager.$inject = ['$http', '$cacheFactory'];

export {Manager};

