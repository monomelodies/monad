
"use strict";

import Model from '../classes/Model';
import Collection from '../classes/Collection';

let isDateTime = new RegExp(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
let isDate = new RegExp(/^(\d{4})-(\d{2})-(\d{2})/);
let http = undefined;
let cache = undefined;

/**
 * Internal helper method to normalize data for Angular:
 * - dates are actual Date objects
 * - numbers are actual Number objects
 *
 * @param object obj An object to normalize.
 * @return object Then normalized object.
 * @todo Make this more generic and recursize? We might want to be able to
 *  also inject it into Socket handlers for instance.
 */
function normalize(obj) {
    for (let prop in obj) {
        let value = obj[prop];
        if (value != undefined) {
            let checkDate = isDateTime.exec(value);
            if (!checkDate) {
                checkDate = isDate.exec(value);
            }
            if (checkDate) {
                checkDate.shift();
                // Javascript months are offset by 0 for reasons only Brendan Eich knows...
                checkDate[1]--;
                value = new Date(...checkDate);
            } else if ((value - 0) == value && ('' + value).trim().length > 0) {
                value = value - 0;
            }
        }
        obj[prop] = value;
    }
    return obj;
}

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
        collection.$promise = http.get(url, cache).then(result => {
            result.data.map(value => collection.push((new this.constructor.Model()).$load(normalize(value))));
            return collection;
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
        model.$promise = http.get(url, cache).then(result => {
            return model.$load(normalize(result.data));
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
                model.$load(undefined);
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

