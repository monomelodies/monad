
export default () => {
    return {
        restrict: 'E',
        templateUrl: 'monad/src/directives/update/template.html',
        transclude: true,
        scope: {
            save: '&onSave',
            item: '=',
            module: '=',
            list: '='
        }
    };
};

