
"use strict";

angular.module('monad.components.update', [])
    .component('moUpdate', {
        templateUrl: '/monad/components/Update/template.html',
        transclude: true,
        bindings: {data: '=', list: '@', type: '@', title: '@'},
        controller: ['gettextCatalog', '$q', 'moReport', '$route', '$uibModal', '$location', 'moLanguage', function (gettextCatalog, $q, moReport, $route, $uibModal, $location, moLanguage) {
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

                function saveit(resource = undefined) {
                    return item => {
                        if (angular.isArray(item)) {
                            item.map(saveit(item));
                        } else if (typeof item == 'object') {
                            if (item.$save) {
                                if (item.$deleted) {
                                    operations++;
                                    item.$delete({}, progress);
                                } else if (!item.id || item.$dirty) {
                                    operations++;
                                    item.$save({}, progress);
                                }
                            } else if (!item.$deleted) {
                                operations++;
                                resource.save(item, progress);
                            }
                        }
                    };
                };

                for (let i in this.data) {
                    saveit()(this.data[i]);
                }
                moReport.add(
                    'info',
                    '<p style="text-align: center">' + gettextCatalog.getString('Saving...') + '</p>' +
                    '<uib-progressbar type="info" class="progress-striped" value="msg.data.progress"></uib-progressbar>',
                    this,
                    promise
                );
            };

            let self = this;
            this['delete'] = function () {
                let modalInstance = $uibModal.open({
                    template: `
<div class="modal-header"><h3 class="modal-title" translate>Delete item</h3></div>
<div class="modal-body">
    <p translate>Deleting can't be undone, are you sure?</p>
</div>
<div class="modal-footer">
    <button class="btn btn-warning" ng-click="cancel()" translate>Cancel</button>
    <button class="btn btn-success" ng-click="ok()" translate>Yes, I'm really sure</button>
</div>`,
                    controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
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

