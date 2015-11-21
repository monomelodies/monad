
class controller {

    constructor($scope, $route, $transclude, $element) {
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
            hdrs.each((i, hdr) => {
                this.columns.push(angular.element(hdr).attr('property'));
            });
            $element.find('thead tr').append(hdrs);
        } else {
            let h = $element.find('thead tr');
            this.columns.map(col => {
                h.append('<th>' + col + '</th>');
            });
        }
    }
}

controller.$inject = ['$scope', '$route', '$transclude', '$element'];

export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '../monad/directives/list/table/template.html',
        scope: {rows: '=', templates: '='},
        controller,
        controllerAs: 'tbody',
        link: (scope, elem, attrs, ctrl) => {
            scope.tbody.component = ctrl.component;
        },
        bindToController: true,
        transclude: true
    };
};

