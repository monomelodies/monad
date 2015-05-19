
"use strict";

import {default as ListHeader} from './list/header/directive';
import {default as ListTable} from './list/table/directive';
import {default as Path} from './path';
import {default as Field} from './field/directive';
import {default as Update} from './update/directive';
import {default as Draggable} from './draggable/directive';
import {default as List} from './list';

angular.module('monad.directives', ['ng'])
    .directive('moList', List)
    .directive('moListHeader', ListHeader)
    .directive('moListTable', ListTable)
    .directive('moPath', Path)
    .directive('moField', Field)
    .directive('moUpdate', Update)
    .directive('moDraggable', Draggable)
    ;

export default 'monad.directives';

