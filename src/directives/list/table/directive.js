
import {Controller as controller} from './controller';

export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '../monad/directives/list/table/template.html',
        scope: {rows: '=', total: '@', page: '='},
        controller,
        link: (scope, elem, attrs, ctrl) => {
            scope.columns = ctrl.columns;
            scope.module = ctrl.module;
            scope.path = ctrl.path;
        },
        bindToController: true
    };
};

