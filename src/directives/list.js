
export default () => {
    return {
        restrict: 'EA',
        scope: {module: '@', columns: '=', path: '@'},
        controller: ['$scope', $scope => {}],
        controllerAs: 'list',
        bindToController: true
    };
};

