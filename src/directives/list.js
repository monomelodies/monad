
"use strict";

export default () => {
    return {
        restrict: 'A',
        scope: {component: '=moList'},
        controller: ['$scope', $scope => {}],
        controllerAs: 'list',
        bindToController: true
    };
};

