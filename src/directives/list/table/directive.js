
import {Controller as controller} from './controller';

export default () => {
    return {
        restrict: 'E',
        templateUrl: 'monad/src/directives/list/table/template.html',
        scope: {list: '=', columns: '=', path: '='},
        controller,
        bindToController: true
    };
};

