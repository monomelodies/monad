
"use strict";

export default ['$modal', '$q', ($modal, $q) => {
    return {
        restrict: 'A',
        link: ($scope, elem, attrs) => {
            let $parent = $scope;
            $scope['delete'] = (item, manager) => $q((resolve, reject) => {
                let modalInstance = $modal.open({
                    template: `<div class="modal-header"><h3 class="modal-title">{{'monad.delete.title' | translate}}</h3></div>
                        <div class="modal-body">
                            {{'monad.delete.body' | translate}}
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" ng-click="ok()">{{'monad.delete.ok' | translate}}</button>
                            <button class="btn btn-warning" ng-click="cancel()">{{'monad.delete.cancel' | translate}}</button>
                        </div>`,
                    controller: ['$scope', '$modalInstance', ($scope, $modalInstance) => {
                        $scope.ok = () => {
                            manager['delete'](item).success(() => {
                                $modalInstance.close(item);
                                resolve('ok, deleted');
                            });
                        };
                        $scope.cancel = () => {
                            $modalInstance.dismiss('cancel');
                            reject('cancelled');
                        };
                    }]
                });
            });
        }
    };
}];

