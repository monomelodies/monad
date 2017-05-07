
"use strict";

let monadLanguageService = undefined;
let Authentication = undefined;

class controller {

    constructor(_monadLanguageService_, _Authentication_, MONAD_VERSION) {
        monadLanguageService = _monadLanguageService_;
        Authentication = _Authentication_;
        this.version = MONAD_VERSION;
    }

    get language() {
        return monadLanguageService.current || 'en';
    }

    get languages() {
        return monadLanguageService.list || ['en'];
    }

    get authenticated() {
        return Authentication.check;
    }

};

controller.$inject = ['monadLanguageService', 'Authentication', 'MONAD_VERSION'];

export default angular.module('monad.components.footer', ['monad.cms'])
    .component('monadFooter', {
        templateUrl: 'Monad/components/Footer/template.html',
        controller
    })
    .name;

