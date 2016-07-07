
"use strict";

import Field from './Field';
import DragDrop from './dragDrop';
import Slug from './slug';
import Message from './message';

export default angular.module('monad.directives', [])
    .directive('moField', Field)
    .directive('moDragDrop', DragDrop)
    .directive('moSlug', Slug)
    .directive('moMessage', Message)
    .name
    ;

