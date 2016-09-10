
"use strict";

let promises = [];
let $q = undefined;

export default class Progress {

    constructor(_$q_) {
        $q = _$q_;
    }

    schedule(obj, callback) {
        promises.push({obj, callback});
    }

    run() {
        let deferred = $q.defer();
        promises.map((promise, idx) => {
            promise.obj[promise.callback](() => {
                promises.splice(idx, 1);
                if (!promises.length) {
                    deferred.resolve('done');
                }
            });
        });
        return deferred.promise;
    }

    get progress() {
        return promises.length;
    }

};

Progress.$inject = ['$q'];

