
class controller {

    constructor($scope, $route, $transclude) {
        this.refresh = promise => promise.then(() => {
            $route.reset();
            this.list.page = this.list.page;
        });
        this.columns = [];
        if (this.items && this.items.length) {
            for (let key in this.items[0]) {
                this.columns.push(key);
            }
        }
        let hdrs = $transclude().find('th');
        if (hdrs.length) {
            this.columns = [];
            angular.forEach(hdrs, hdr => this.columns.push(angular.element(hdr).attr('property')));
            this.header = hdrs.parent('tr');
        } else {
            this.header = angular.element('<tr/>');
            this.columns.map(col => this.header.append('<th>' + col + '</th>'));
        }
    }
}

controller.$inject = ['$scope', '$route', '$transclude'];

export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '../monad/directives/list/table/template.html',
        scope: {rows: '=', templates: '='},
        controller,
        controllerAs: 'tbody',
        bindToController: true,
        transclude: true,
        link: (scope, elem, attrs, ctrl) => {
            scope.tbody.component = ctrl.component;
            elem.find('thead').append(scope.tbody.header);
        }
    };
};

