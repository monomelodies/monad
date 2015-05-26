
"use strict";

export default () => {
    return {
        restrict: 'EA',
        scope: {module: '='},
        controller: ['$scope', $scope => {}],
        controllerAs: 'list',
        bindToController: true
    };
};

