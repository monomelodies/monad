
"use strict";

let isDateTime = new RegExp(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
let isDate = new RegExp(/^(\d{4})-(\d{2})-(\d{2})/);

/**
 * Internal helper method to normalize data for Angular:
 * - dates are actual Date objects
 * - numbers are actual Number objects
 *
 * @param object obj An object to normalize.
 * @return object Then normalized object.
 */
export default function normalize(obj) {
    for (let prop in obj) {
        let value = obj[prop];
        if (value != undefined) {
            if (angular.isArray(value)) {
                value.map(item => normalize(item));
                continue;
            }
            if (typeof value == 'string') {
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
            } else if (typeof value != 'undefined' && typeof value == 'object') {
                value = normalize(value);
            }
        }
        obj[prop] = value;
    }
    return obj;
};

