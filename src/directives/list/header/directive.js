
export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '../monad/directives/list/header/template.html',
        scope: {create: '@'},
        transclude: true,
        link: (scope, elem, attrs, ctrl) => {
            scope.module = ctrl.module;
        }
    };
};

