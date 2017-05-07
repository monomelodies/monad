
"use strict";

import DragDrop from './dragDrop';
import Slug from './slug';
import Message from './message';

export default angular.module('monad.directives', ['monad.cms'])
    .directive('moDragDrop', DragDrop)
    .directive('moSlug', Slug)
    .directive('moMessage', Message)
    .name
    ;

