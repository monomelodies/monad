
"use strict";

let defaults = {
    onSave: 'crud.save()',
    onDelete: 'crud.delete()',
    item: 'crud.item',
    module: 'crud.module'
};

export default () => {
    return {
        restrict: 'E',
        templateUrl: '../monad/directives/update/template.html',
        transclude: true,
        scope: {
            save: '&onSave',
            'delete': '&onDelete',
            item: '=',
            module: '='
        },
        compile: (element, attrs) => {
            for (let attr in defaults) {
                if (!(attr in attrs)) {
                    attrs[attr] = defaults[attr];
                }
            }
        }
    };
};

