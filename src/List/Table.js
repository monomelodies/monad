
export default () => {
    return {
        restrict: 'E',
        templateUrl: 'monad/template/list/table.html',
        scope: {module: '=', items: '=', columns: '='},
        controller: () => {},
        controllerAs: 'table',
        bindToController: true
    };
};

