
export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '../monad/directives/list/table/template.html',
        scope: {columns: '=', rows: '=', total: '@', page: '=', inlines: '='},
        controller: ['$scope', '$route', function($scope, $route) {
            this.handle = (item, handler) => {
                handler(item).success(() => {
                    $route.reset();
                //    $route.reload();
                });
            };
        }],
        controllerAs: 'tbody',
        link: (scope, elem, attrs, ctrl) => {
            scope.tbody.module = ctrl.module;
        },
        bindToController: true
    };
};

