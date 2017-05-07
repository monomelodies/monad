
"use strict";

let $location = undefined;

export default class Location {

    constructor(_$location_) {
        $location = _$location_;
    }

    path(...args) {
        $location.path(...args);
    }

    search(...args) {
        return $location.search(...args);
    }

    make(url) {
        return url;
    }

};

Location.$inject = ['$location'];

