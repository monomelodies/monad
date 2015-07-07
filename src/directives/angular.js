
"use strict";

import {default as ListHeader} from './list/header/directive';
import {default as ListTable} from './list/table/directive';
import Delete from './list/table/delete';
import {default as Path} from './path';
import {default as Field} from './field/directive';
import {default as Update} from './update/directive';
import {default as DragDrop} from './dragDrop';
import {default as List} from './list';
import {default as Slug} from './slug';

angular.module('monad.directives', ['ng'])
    .directive('moList', List)
    .directive('moListHeader', ListHeader)
    .directive('moListTable', ListTable)
    .directive('moDelete', Delete)
    .directive('moPath', Path)
    .directive('moField', Field)
    .directive('moUpdate', Update)
    .directive('moDragDrop', DragDrop)
    .directive('moSlug', Slug)
    ;

export default 'monad.directives';

