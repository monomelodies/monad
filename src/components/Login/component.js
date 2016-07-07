
"use strict";

export default angular.module('monad.components.login', [])
    .component('moLogin', {
        templateUrl: '/monad/components/Login/template.html',
        controller: ['Authentication', function (auth) {
            this.auth = auth;
            this.credentials = {};
        }],
        transclude: true
    })
    .name
    ;

