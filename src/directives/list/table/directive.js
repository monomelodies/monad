
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
            this.columns.map(col => this.header.append('<th property="' + col + '">' + col + '</th>'));
        }
        let sortable = false;
        if (this.allowSorting) {
            if (this.allowSorting == '*') {
                sortable = this.columns;
            } else {
                sortable = this.allowSorting.split(',');
            }
        }
        if (sortable) {
            angular.forEach(this.header.find('th'), hdr => {
                let h = angular.element(hdr);
                let prop = h.attr('property');
                if (sortable.indexOf(prop) != -1) {
                    h.html('<a ng-href ng-click="tbody.sort(' + prop + ')">' + h.html() + '</a>');
                }
            });
        }
    }
}

controller.$inject = ['$scope', '$route', '$transclude'];

export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '/monad/directives/list/table/template.html',
        scope: {rows: '=', templates: '=', allowSorting: '@'},
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

