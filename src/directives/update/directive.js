
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
        controller,
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

class controller {

    constructor($transclude, $timeout) {
        if (this.item.$new) {
            // New items have no notion of their fields yet,
            // so we need to manually build the properties
            // by analysing the transcluded schema.
            $timeout(() => {
                let test = angular.element('#mo_update_form').html().match(/ng-model="crud\.item\.(.*?)"/g);
                let props = {};
                if (test) {
                    for (let i = 0; i < test.length; i++) {
                        let item = test[i].replace('ng-model="crud.item.', '').replace('"', '');
                        props[item] = null;
                    }
                }
                this.item = this.item.constructor.$create(props);
            }, 100);
        }
    }

}

controller.$inject = ['$transclude', '$timeout'];

