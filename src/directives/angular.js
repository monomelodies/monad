
"use strict";

import Delete from './list/table/delete';
import Path from './path';
import Field from './field/directive';
import DragDrop from './dragDrop';
import Slug from './slug';
import Message from './message';

angular.module('monad.directives', [])
    .directive('moDelete', Delete)
    .directive('moPath', Path)
    .directive('moField', Field)
    .directive('moDragDrop', DragDrop)
    .directive('moSlug', Slug)
    .directive('moMessage', Message)
    ;

