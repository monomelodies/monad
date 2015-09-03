
"use strict";

export default () => {
    return {
        restrict: 'EA',
        scope: {component: '=moList'},
        controller: ['$scope', $scope => {}],
        controllerAs: 'list',
        bindToController: true
    };
};

