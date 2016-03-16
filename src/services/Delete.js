
"use strict";

let $uibModal = undefined;
let moLanguage = undefined;
let $location = undefined;
let $route = undefined;

export default class Delete {

    constructor(_$uibModal_, _moLanguage_, _$location_, _$route_) {
        $uibModal = _$uibModal_;
        moLanguage = _moLanguage_;
        $location = _$location_;
        $route = _$route_;
    }

    /**
     * Ask for confirmation before deleting.
     *
     * @param Resource item The resource to delete.
     * @param string list Optional list URL to navigate to after deletion.
     */
    ask(item, list = undefined) {
        let modalInstance = $uibModal.open({
            template: `<div class="modal-header"><h3 class="modal-title" translate>Delete item</h3></div>
<div class="modal-body">
    <p translate>Deleting can't be undone, are you sure?</p>
</div>
<div class="modal-footer">
    <button class="btn btn-warning" ng-click="cancel()" translate>Cancel</button>
    <button class="btn btn-success" ng-click="ok()" translate>Yes, I'm really sure</button>
</div>`,
            controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                $scope.ok = () => {
                    $uibModalInstance.dismiss('ok');
                    item.$delete();
                    if (list) {
                        $location.path('/' + moLanguage.current + list);
                    } else {
                        $route.reset();
                    }
                };
                $scope.cancel = () => {
                    $uibModalInstance.dismiss('cancel');
                };
            }],
            size: 'xs'
        });
    }

};

Delete.$inject = ['$uibModal', 'moLanguage', '$location', '$route'];

