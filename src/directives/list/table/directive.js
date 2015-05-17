
import {Controller as controller} from './controller';

export default () => {
    return {
        require: '^moList',
        restrict: 'E',
        templateUrl: 'monad/src/directives/list/table/template.html',
        scope: {rows: '=', path: '@', total: '@', page: '='},
        controller,
        link: (scope, elem, attrs, ctrl) => {
            scope.columns = scope.$eval(attrs.columns);
            scope.module = ctrl.module;
        },
        bindToController: true
    };
};

