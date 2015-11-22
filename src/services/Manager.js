
"use strict";

import Model from '../classes/Model';
import Collection from '../classes/Collection';

let http = undefined;
let cache = undefined;

function appendTransform(transform) {
    let defaults = http.defaults.transformResponse;
    defaults = angular.isArray(defaults) ? defaults : [defaults];
    return defaults.concat(transform);
};

/**
 * Default base Manager to extend upon.
 */
export default class Manager {

    /**
     * Class constructor.
     *
     * @param object $http Injected $http service.
     * @param object $cacheFactory Injector $cacheFactory service.
     * @return void
     */
    constructor($http, $cacheFactory) {
        http = $http;
        if (cache === undefined) {
            cache = $cacheFactory('monad-managers');
        }
        /**
         * Bindable pointer for specified list filters, if any.
         */
        this.filter = {};
    }

    /**
     * Apply the currently set filter to params.
     *
     * @param object params Hash of params to augment.
     * @return object Augmented params.
     */
    applyFilter(params) {
        if (this.filter) {
            for (let p in this.filter) {
                if (this.filter[p] !== false) {
                    params[p] = this.filter[p];
                }
            }
        }
        return params;
    }

    /**
     * Virtual getter for the cache object.
     */
    get cache() {
        return cache;
    }

    /**
     * Virtual count of total current list items. Here it returns 0; your custom
     * Manager _may_ offer an actual implementation of this (it depends on the
     * API you're using).
     *
     * @return integer Number of total items in the current list.
     */
    get count() {
        return 0;
    }

    /**
     * Retrieve a list (Collection) of items.
     *
     * @param string url The API URL to query.
     * @return Collection A collection of Models found.
     */
    list(url) {
        let collection = new this.constructor.Collection;
        collection.$promise = http({
            url,
            method: 'GET',
            transformResponse: appendTransform(values => {
                values.map(value => collection.push((new this.constructor.Model()).$load(value)));
                return collection;
            }),
            cache
        });
        return collection;
    }

    /**
     * Find a single item.
     *
     * @param string url The API URL to query.
     * @return Model A Model.
     */
    find(url) {
        let model = new this.constructor.Model;
        model.$promise = http({
            url,
            method: 'GET',
            transformResponse: appendTransform(item => model.$load(item)),
            cache
        });
        return model;
    }

    /**
     * Save the specified model back to the API.
     *
     * @param object model The model to save.
     * @return mixed On success, a Promise yielding the API's return value on
     *  `success`. On failure (because e.g. model is not dirty) an empty object.
     */
    save(model) {
        if (model.$new) {
            return this.create(model).then(result => model.$load(result.data));
        } else if (model.$deleted) {
            return this['delete'](model).then(() => {
                model.$data = {};
                model.$initial = undefined;
            });
        } else if (model.$dirty) {
            return this.update(model).then(result => model.$load(result.data));
        }
        return {};
    }

    /**
     * API interface. These should be overridden by a custom implementation,
     * since we have no way to guesstimate how your API works. Hence, these
     * throw an error as a friendly reminder :)
     *
     * The actual implementations should return promises.
     *
     * @param object model The model to create.
     */
    create(model) {
        throw "Manager.create must use a custom implementation.";
    }

    /**
     * API interface. These should be overridden by a custom implementation,
     * since we have no way to guesstimate how your API works. Hence, these
     * throw an error as a friendly reminder :)
     *
     * The actual implementations should return promises.
     *
     * @param object model The model to update.
     */
    update(model) {
        throw "Manager.update must use a custom implementation.";
    }

    /**
     * API interface. These should be overridden by a custom implementation,
     * since we have no way to guesstimate how your API works. Hence, these
     * throw an error as a friendly reminder :)
     *
     * The actual implementations should return promises.
     *
     * @param object model The model to delete.
     */
    ['delete'](model) {
        throw "Manager.delete must use a custom implementation.";
    }

    /**
     * Virtual property to access the $http service.
     *
     * @return object Angular $http service.
     */
    get http() {
        return http;
    }

};

Manager.$inject = ['$http', '$cacheFactory'];
/**
 * The current Model class to work on. You may set this per derived
 * manager where needed. Defaults to base Monad Model.
 */
Manager.Model = Model;
/**
 * The current Collection object to work on. You may set this per
 * derived manager where needed. Defaults to base Monad Collection.
 */
Manager.Collection = Collection;

