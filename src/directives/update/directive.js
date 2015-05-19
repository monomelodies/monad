
export default () => {
    return {
        restrict: 'E',
        templateUrl: '../monad/directives/update/template.html',
        transclude: true,
        scope: {
            save: '&onSave',
            'delete': '&onDelete',
            item: '=',
            module: '@',
            list: '@'
        }
    };
};

