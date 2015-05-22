
"use strict";

let isDate = new RegExp(/^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/);
let mapper = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12'
};

function map(month) {
    return mapper[month];
};

class Model {

    constructor() {
        this.$data = {};
        this.$fields = [];
        this.$deleted = false;
        this.$new = true;
    }

    $create(data = {}, recursive = true) {
        let result = (new this.constructor()).$load(data, recursive);
        result.$new = true;
        return result;
    }

    $load(data = {}, recursive = true) {
        this.$initial = data;
        this.$new = false;
        for (let key in data) {
            let checkDate = isDate.exec(data[key]);
            if (checkDate) {
                checkDate.shift();
                data[key] = new Date(...checkDate);
            }
            var props = {enumerable: true, configurable: true};
            if (!this.hasOwnProperty(key)) {
                props.get = () => {
                    return this.$data[key];
                };
                props.set = value => {
                    this.$data[key] = value;
                };
            }
            Object.defineProperty(this, key, props);
            this.$data[key] = data[key];
            this.$fields.push(key);
        }
        return this;
    }

    $update() {
        for (let field in this) {
            if (field.substring(0, 1) == '$') {
                continue;
            }
            if (typeof this[field] == 'object' && this[field] != null) {
                if ('$delete' in this[field] && this[field].$deleted) {
                    this[field].$delete();
                } else if ('$update' in this[field] && this[field].$dirty) {
                    this[field].$update();
                } else if ('map' in this[field]) {
                    this[field].map(item => {
                        if (typeof item == 'object') {
                            if ('$delete' in item && item.$deleted) {
                                item.$delete();
                            } else if ('$update' in item && item.$dirty) {
                                item.$update();
                            }
                        }
                    });
                }
            }
            if (this.$initial[field]) {
                this.$initial[field] = this.$data[field];
            }
        }
    }

    get $dirty() {
        if (this.$deleted) {
            return true;
        }
        if (this.$new) {
            return false;
        }
        for (let key in this) {
            if (key.substring(0, 1) == '$') {
                continue;
            }
            if (key in this.$data && this.$data[key] != this.$initial[key]) {
                return true;
            } else if (typeof this[key] == 'object' && this[key] != null) {
                if ('map' in this[key]) {
                    let dirty = false;
                    this[key].map(elem => {
                        if (typeof elem == 'object' && elem.$dirty || elem.$deleted) {
                            dirty = true;
                        }
                    });
                    if (dirty) {
                        return true;
                    }
                } else if (this[key].$dirty || this[key].$deleted) {
                    return true;
                }
            }
        }
        return false;
    }

    $pluralize(field) {
        field = field.replace(/y$/, 'ie');
        return this[field + 's'];
    }

    $export() {
        let data = {};
        for (let prop in this) {
            if (prop.substring(0, 1) == '$') {
                continue;
            }
            if (typeof this[prop] == 'object' && 'getFullYear' in this[prop]) {
                let d = (this[prop] + '').split(' ');
                data[prop] = [d[3], map(d[1]), d[2]].join('-') + ' '+ d[4];
            } else {
                data[prop] = this[prop];
            }
        }
        return data;
    }

};

export {Model};

