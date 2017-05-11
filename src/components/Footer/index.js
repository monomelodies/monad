
"use strict";

import controller from './Controller';

export default angular.module('monad.components.footer', ['monad.cms'])
    .component('monadFooter', {
        templateUrl: 'Monad/components/Footer/template.html',
        controller
    })
    .name;

