
export default () => {
    return {
        restrict: 'E',
        templateUrl: 'monad/src/directives/list/header/template.html',
        scope: {create: '@', module: '@'},
        transclude: true
    };
};

