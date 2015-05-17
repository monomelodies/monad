
export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: 'monad/src/directives/list/header/template.html',
        scope: {create: '@'},
        transclude: true,
        link: (scope, elem, attrs, ctrl) => {
            scope.module = ctrl.module;
        }
    };
};

