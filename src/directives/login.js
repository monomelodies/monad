
"use strict";

export default () => ({
    restrict: 'E',
    templateUrl: '/monad/templates/login.html',
    controller: ['Authentication', function (auth) {
        this.auth = auth;
        this['default'] = !(this.template || this.templateUrl);
    }],
    controllerAs: 'login',
    bindToController: true,
    transclude: true,
    scope: {template: '=', templateUrl: '='}
});

