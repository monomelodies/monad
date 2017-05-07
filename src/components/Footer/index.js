
"use strict";

let monadLanguageService = undefined;

class controller {

    constructor(_monadLanguageService_, Authentication) {
        monadLanguageService = _monadLanguageService_;
        this.authenticated = Authentication.check;
    }

    get language() {
        return monadLanguageService.current || 'en';
    }

    get languages() {
        return monadLanguageService.list || ['en'];
    }

};

controller.$inject = ['monadLanguageService', 'Authentication'];

export default angular.module('monad.components.footer', ['monad.cms'])
    .component('monadFooter', {
        templateUrl: 'Monad/components/Footer/template.html',
        controller
    })
    .name;

