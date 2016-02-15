
"use strict";

angular.module('monad.components.update', [])
    .component('moUpdate', {
        templateUrl: '/monad/components/Update/template.html',
        transclude: true,
        bindings: {item: '=', list: '@', type: '@', title: '@'},
        controller: ['gettextCatalog', '$q', 'moReport', '$route', function (gettextCatalog, $q, moReport, $route) {
            this.save = function () {
                let promise = $q.defer();
                let operations = 0;
                this.progress = 0;
                let done = 0;
                let progress = () => {
                    done++;
                    this.progress = (done / promises.length) * 100;
                    if (done == promises.length) {
                        promise.resolve('ok');
                        $route.reset();
                    }
                };
                for (let i in this) {
                    if (typeof this[i] == 'object' && this[i].$save) {
                        console.log(this[i]);
                        this[i].$save(progress);
                        operations++;
                    } else if (angular.isArray(this[i])) {
                        /*
                        let remove = [];
                        this[i].map((item, index) => {
                            console.log(item);
                            if (item.$deleted) {
                                item.$delete({}, progress);
                                operations++;
                            } else if (item.$save) {
                                item.$save({}, progress);
                                operations++;
                            }
                        });
                        */
                    }
                }
                /*
                moReport.add(
                    'info',
                    '<p style="text-align: center">' + gettextCatalog.getString('Saving...') + '</p>' +
                    '<uib-progressbar type="info" class="progress-striped" value="msg.data.progress"></uib-progressbar>',
                    this,
                    promise
                );
                */
            };
        }]
    })
    ;
/*
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
        templateUrl: '/monad/directives/update/template.html',
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
                let test = angular.element(document.querySelector('#mo_update_form')).html().match(/ng-model="crud\.item\.(.*?)"/g);
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
*/

