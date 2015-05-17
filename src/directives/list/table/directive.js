
import {Controller as controller} from './controller';

export default () => {
    return {
        restrict: 'E',
        templateUrl: 'monad/src/directives/list/table/template.html',
        scope: {list: '=', columns: '@', path: '@'},
        controller,
        link: (scope, elem, attrs) => {
            scope.columns = scope.$eval(attrs.columns);
        },
        bindToController: true
    };
};

