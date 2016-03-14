
"use strict";

import Model from '../../Model';

let gettext = undefined;
let $q = undefined;
let moReport = undefined;
let $route = undefined;
let $uibModal = undefined;
let $location = undefined;
let moLanguage = undefined;

class controller {

    constructor(_gettext, _$q, _moReport, _$route, _$uibModal, _$location, _moLanguage) {
        gettext = _gettext;
        $q = _$q;
        moReport = _moReport;
        $route = _$route;
        $uibModal = _$uibModal;
        $location = _$location;
        moLanguage = _moLanguage;
    }

    save() {
        let promise = $q.defer();
        let operations = 0;
        this.progress = 0;
        let done = 0;
        let isNew = !this.data.item.$delete;
        let progress = () => {
            done++;
            this.progress = (done / operations) * 100;
            if (done == operations) {
                promise.resolve('ok');
                $route.reset();
                if (isNew) {
                    $location.path(moLanguage.current + this.list);
                }
            }
        };

        function $save(item) {
            if (angular.isArray(item)) {
                item.map($save);
            } else if (item instanceof Model) {
                if (item.$deleted) {
                    operations++;
                    item.$delete(progress);
                } else if (!item.id || item.$dirty) {
                    operations++;
                    item.$save(progress);
                }
            }
        };

        for (let i in this.data) {
            $save(this.data[i]);
        }
        moReport.add(
            'info',
            '<p style="text-align: center" translate>' + gettext('Saving...') + '</p>' +
            '<uib-progressbar type="info" class="progress-striped" value="msg.data.progress"></uib-progressbar>',
            this,
            promise
        );
    }

    ['delete']() {
        let modalInstance = $uibModal.open({
            templateUrl: 'modal.html',
            controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                $scope.options = this.options;
                $scope.prefix = this.prefix;
                $scope.property = this.property;
                $scope.multiple = this.multiple;
                $scope.ok = () => {
                    $uibModalInstance.dismiss('ok');
                    this.data.item.$delete();
                    $location.path('/' + moLanguage.current + self.list);
                };
                $scope.cancel = () => {
                    $uibModalInstance.dismiss('cancel');
                };
            }],
            size: 'xs'
        });
    }

    get ['$dirty']() {
            for (let i in this.data) {
                if (angular.isArray(this.data[i])) {
                    for (let j = 0; j < this.data[i].length; j++) {
                        // Deleted, dirty or new
                        if (this.data[i][j].$deleted || this.data[i][j].$dirty || !('$save' in this.data[i][j])) {
                            return true;
                        }
                    }
                } else if (this.data[i].$deleted || this.data[i].$dirty) {
                    return true;
                }
            }
            return false;
    }

}

controller.$inject = ['gettext', '$q', 'moReport', '$route', '$uibModal', '$location', 'moLanguage'];

angular.module('monad.components.update', [])
    .component('moUpdate', {
        templateUrl: '/monad/components/Update/template.html',
        transclude: true,
        bindings: {data: '=', list: '@', type: '@', title: '@'},
        controller
    })
    ;

