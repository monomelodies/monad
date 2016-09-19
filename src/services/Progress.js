
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
        let todo = promises.length;
        let done = 0;
        promises.map((promise, idx) => {
            promise.obj[promise.callback](() => {
                if (++done == todo) {
                    promises = [];
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

