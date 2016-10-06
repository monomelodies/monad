
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
        let this.todo = promises.length;
        let this.done = 0;
        promises.map((promise, idx) => {
            promise.obj[promise.callback](() => {
                if (++this.done == this.todo) {
                    promises = [];
                    deferred.resolve('done');
                }
            });
        });
        return deferred.promise;
    }

    get progress() {
        return Math.round(this.done / this.todo * 100);
    }

};

Progress.$inject = ['$q'];

