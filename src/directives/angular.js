
"use strict";

import Path from './path';
import Field from './Field';
import DragDrop from './dragDrop';
import Slug from './slug';
import Message from './message';

angular.module('monad.directives', [])
    .directive('moPath', Path)
    .directive('moField', Field)
    .directive('moDragDrop', DragDrop)
    .directive('moSlug', Slug)
    .directive('moMessage', Message)
    ;

