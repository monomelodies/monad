
"use strict";

let Authentication = undefined;
let $uibModal = undefined;

export default class controller {

    constructor(_Authentication_, _$uibModal_, MONAD_VERSION, MONAD_COPYRIGHT) {
        Authentication = _Authentication_;
        $uibModal = _$uibModal_;
        this.version = MONAD_VERSION;
        this.copyright = MONAD_COPYRIGHT;
    }

    license() {
        $uibModal.open({
            templateUrl: 'Monad/templates/license.html',
            controller: ['$uibModalInstance', '$scope', function ($uibModalInstance, $scope) {
                $scope.ok = () => $uibModalInstance.dismiss();
            }]
        });
    };

};

controller.$inject = ['Authentication', '$uibModal', 'MONAD_VERSION', 'MONAD_COPYRIGHT'];

