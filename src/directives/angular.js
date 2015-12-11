
"use strict";

import ListHeader from './list/header/directive';
import ListTable from './list/table/directive';
import Delete from './list/table/delete';
import Path from './path';
import Field from './field/directive';
import Update from './update/directive';
import DragDrop from './dragDrop';
import List from './list';
import Slug from './slug';
import Label from './label';
import Message from './message';

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
    .directive('moMenuLabel', Label)
    .directive('moMessage', Message)
    ;

export default 'monad.directives';

