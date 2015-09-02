
export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '../monad/directives/list/table/template.html',
        scope: {rows: '=', total: '@', list: '=', templates: '='},
        controller: ['$scope', '$route', '$transclude', '$element', function($scope, $route, $transclude, $element) {
            this.refresh = promise => promise.then(() => {
                $route.reset();
                this.list.page = this.list.page;
            });
            this.columns = [];
            let hdrs = $transclude().find('th');
            hdrs.each((i, hdr) => {
                this.columns.push(angular.element(hdr).attr('property'));
            });
            $element.find('thead tr').append(hdrs);
        }],
        controllerAs: 'tbody',
        link: (scope, elem, attrs, ctrl) => {
            scope.tbody.module = ctrl.module;
        },
        bindToController: true,
        transclude: true
    };
};

