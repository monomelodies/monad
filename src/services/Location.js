
"use strict";

let $location = undefined;
let base = '';

export default class Location {

    constructor(_$location_) {
        $location = _$location_;
        base = document.querySelector('base') ? document.querySelector('base').href.replace(/^https?:\/\/.*?\//, '/') : '/';
    }

    path(...args) {
        args[0] = removeBase(args[0]);
        $location.path(...args);
    }

    search(...args) {
        return $location.search(...args);
    }

    make(url) {
        return (base + url).replace(/\/{2,}/g, '/');
    }

};

function removeBase(url) {
    const regEx = new RegExp(`^${base}`);
    url = url.replace(regEx, '/');
    return url;
};

Location.$inject = ['$location'];

