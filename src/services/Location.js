
"use strict";

let $location = undefined;
let base = '';

export default class Location {

    constructor(_$location_) {
        $location = _$location_;
        base = document.querySelector('base').href;
    }

    path(...args) {
        $location.path(...args);
    }

    search(...args) {
        return $location.search(...args);
    }

    make(url) {
        return (base + url).replace(/\/{2,}/, '/');
    }

};

Location.$inject = ['$location'];

