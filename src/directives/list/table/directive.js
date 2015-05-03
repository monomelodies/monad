
import {Controller as controller} from './controller';

export default () => {
    return {
        restrict: 'E',
        templateUrl: 'monad/src/directives/list/table/template.html',
        scope: {module: '=', items: '=', columns: '=', path: '='},
        controller,
        bindToController: true
    };
};

