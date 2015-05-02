
import {Controller} from './controller';

export default () => {
    return {
        restrict: 'E',
        templateUrl: 'monad/src/directives/list/table/template.html',
        scope: {module: '=', items: '=', columns: '='},
        controller: Controller,
        controllerAs: 'table',
        bindToController: true
    };
};

