
"use strict";

let monadLanguageService = undefined;
let Authentication = undefined;
let $uibModal = undefined;

export default class controller {

    constructor(_monadLanguageService_, _Authentication_, _$uibModal_, MONAD_VERSION) {
        monadLanguageService = _monadLanguageService_;
        Authentication = _Authentication_;
        $uibModal = _$uibModal_;
        this.version = MONAD_VERSION;
    }

    get language() {
        return monadLanguageService.current || 'en';
    }

    get languages() {
        return monadLanguageService.list || ['en'];
    }

    get authenticated() {
        return Authentication.check;
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

controller.$inject = ['monadLanguageService', 'Authentication', '$uibModal', 'MONAD_VERSION'];

