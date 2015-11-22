
"use strict";

let defaults = {
    onSave: 'crud.save()',
    onDelete: 'crud.delete()',
    item: 'crud.item',
    $dirty: 'crud.$dirty',
    component: 'crud.component'
};

export default () => {
    return {
        restrict: 'E',
        templateUrl: '../monad/directives/update/template.html',
        transclude: true,
        scope: {
            save: '&onSave',
            'delete': '&onDelete',
            $dirty: '=',
            item: '=',
            component: '='
        },
        controller: function() {},
        controllerAs: 'update',
        bindToController: true,
        compile: (element, attrs) => {
            for (let attr in defaults) {
                if (!(attr in attrs)) {
                    attrs[attr] = defaults[attr];
                }
            }
        }
    };
};

