
"use strict";

import Message from './message';

export default angular.module('monad.directives', ['monad.cms'])
    .directive('monadMessage', Message)
    .directive('moMessage', Message)
    .name
    ;

