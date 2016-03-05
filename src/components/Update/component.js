
"use strict";

import Model from '../../Model';

angular.module('monad.components.update', [])
    .component('moUpdate', {
        templateUrl: '/monad/components/Update/template.html',
        transclude: true,
        bindings: {data: '=', list: '@', type: '@', title: '@'},
        controller: ['gettext', '$q', 'moReport', '$route', '$uibModal', function (gettext, $q, moReport, $route, $uibModal) {
            this.save = () => {
                let promise = $q.defer();
                let operations = 0;
                this.progress = 0;
                let done = 0;
                let progress = () => {
                    done++;
                    this.progress = (done / operations) * 100;
                    if (done == operations) {
                        promise.resolve('ok');
                        $route.reset();
                    }
                };

                function $save(item) {
                    if (angular.isArray(item)) {
                        item.map($save);
                    } else if (item instanceof Model) {
                        if (item.$deleted) {
                            operations++;
                            item.$delete({}, progress);
                        } else if (!item.id || item.$dirty) {
                            operations++;
                            item.$save({}, progress);
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
            };

            let self = this;
            this['delete'] = function () {
                let modalInstance = $uibModal.open({
                    templateUrl: 'modal.html',
                    controller: ['$scope', '$uibModalInstance', '$location', 'moLanguage', ($scope, $uibModalInstance, $location, moLanguage) => {
                        $scope.options = this.options;
                        $scope.prefix = this.prefix;
                        $scope.property = this.property;
                        $scope.multiple = this.multiple;
                        $scope.ok = () => {
                            $uibModalInstance.dismiss('ok');
                            self.data.item.$delete();
                            $location.path('/' + moLanguage.current + self.list);
                        };
                        $scope.cancel = () => {
                            $uibModalInstance.dismiss('cancel');
                        };
                    }],
                    size: 'xs'
                });
            };

            Object.defineProperty(this, '$dirty', {get: () => {
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
            }});
        }]
    })
    ;

