
"use strict";

export default (obj, property) => {
    let parts = property.split('.');
    let found = angular.copy(obj);
    while (parts.length) {
        const prop = parts.shift();
        found = found[prop];
    }
    return found;
};

