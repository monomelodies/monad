
export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '../monad/directives/list/table/template.html',
        scope: {columns: '=', rows: '=', total: '@', list: '=', inlines: '='},
        controller: ['$scope', '$route', function($scope, $route) {
            this.handle = (item, handler) => {
                handler(item).success(() => {
                    $route.reset();
                    this.list.page = this.list.page;
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

