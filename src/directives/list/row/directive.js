
"use strict";

import {Controller as controller} from './controller';
import {default as link} from './link';

export default () => {
    return {
        require: '^moListTable',
        restrict: 'A',
        templateUrl: 'monad/src/directives/list/row/template.html',
        scope: {item: '=moListRow'},
        controller,
        controllerAs: 'row',
        link,
        bindToController: true
    };
};

