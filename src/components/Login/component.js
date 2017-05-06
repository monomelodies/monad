
"use strict";

export default angular.module('monad.components.login', ['monad.cms'])
    .component('monadLogin', {
        templateUrl: 'Monad/components/Login/template.html',
        controller: ['Authentication', function (auth) {
            this.auth = auth;
            this.credentials = {};
        }],
        transclude: true
    })
    .name
    ;

