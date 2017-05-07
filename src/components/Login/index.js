
"use strict";

export default angular.module('monad.components.login', ['monad.cms'])
    .component('monadLogin', {
        templateUrl: 'Monad/components/Login/template.html',
        controller: ['Authentication', function (auth) {
            this.$onInit = () => {
                auth = this.auth || auth;
            };
            Object.defineProperty(this, 'check', {get: () => auth.check});
            this.credentials = {};
            this.attempt = (...args) => auth.attempt(...args);
        }],
        transclude: true,
        bindings: {auth: '<'}
    })
    .name
    ;

