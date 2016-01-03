
"use strict";

export default () => ({
    restrict: 'E',
    templateUrl: '/monad/templates/login.html',
    controller: function () {
        this['default'] = !(this.template || this.templateUrl);
    },
    controllerAs: 'login',
    bindToController: true,
    transclude: true,
    scope: {auth: '=', template: '=', templateUrl: '='}
});

