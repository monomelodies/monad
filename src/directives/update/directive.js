
export default () => {
    return {
        restrict: 'E',
        templateUrl: '../monad/directives/update/template.html',
        transclude: true,
        scope: {
            save: '&onSave',
            item: '=',
            module: '@',
            list: '@'
        }
    };
};

