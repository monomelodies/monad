
"use strict";

import Model from '../Model';

/**
 * Extend default $resource service with save method on queried array.
 * In Monad, we want to be able to easily append a new item to an array of
 * queried resources. This exposes a `save` method on the array.
 */
export default ['$resource', $resource => {
    return (url, paramDefaults = {}, actions = {}, options = {}) => {
        let res = $resource(url, paramDefaults, actions, options);
        let query = res.query;
        let get = res.get;
        let bitflags = undefined;
        res.setBitflags = (source, mapping = {}) => {
            bitflags = {source, mapping};
        };
        res.query = (parameters, success, error) => {
            let found = query.call(res, parameters, success, error);
            found.save = function (data, success, error) {
                return res.save({}, data, success, error);
            };
            found.push = (...args) => {
                args.map((arg, i) => {
                    args[i] = new Model(arg);
                    if (bitflags) {
                        args[i].setBitflags(bitflags.source, bitflags.mapping);
                    }
                });
                [].push.apply(found, args);
            };
            found.$promise.then(() => {
                found.map((item, i) => found[i] = new Model(item));
                if (bitflags) {
                    found.map(item => item.setBitflags(bitflags.source, bitflags.mapping));
                }
                return found;
            });
            return found;
        };
        res.get = (parameters, success, error) => new Model(get.call(res, parameters, success, error));
        return res;
    };
}];

