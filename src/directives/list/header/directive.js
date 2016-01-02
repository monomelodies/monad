
export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '/monad/directives/list/header/template.html',
        scope: {},
        transclude: true,
        controller: ['$transclude', function($transclude) {
            this.transcluded = !!$transclude().length;
        }],
        controllerAs: 'header',
        bindToController: true,
        link: (scope, elem, attrs, ctrl) => {
            scope.header.component = ctrl.component;
        }
    };
};

