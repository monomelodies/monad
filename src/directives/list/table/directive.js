
export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '../monad/directives/list/table/template.html',
        scope: {columns: '=', rows: '=', total: '@', page: '='},
        controller: () => {},
        controllerAs: 'tbody',
        link: (scope, elem, attrs, ctrl) => {
            scope.tbody.module = ctrl.module;
        },
        bindToController: true
    };
};

