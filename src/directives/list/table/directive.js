
import {Controller as controller} from './controller';

export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: '../monad/directives/list/table/template.html',
        scope: {columns: '=', rows: '=', total: '@', page: '='},
        controller,
        link: (scope, elem, attrs, ctrl) => {
            scope.module = ctrl.module;
        },
        bindToController: true
    };
};

