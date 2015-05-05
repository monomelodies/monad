
export default () => {
    return {
        restrict: 'E',
        templateUrl: 'monad/src/directives/update/template.html',
        transclude: true,
        scope: {
            update: '&onUpdate',
            'delete': '&onDelete',
            item: '=',
            module: '=',
            listUrl: '='
        }
    };
};

