
"use strict";

let monadLanguageService = undefined;
let Authentication = undefined;

class controller {

    constructor(_monadLanguageService_, _Authentication_) {
        monadLanguageService = _monadLanguageService_;
        Authentication = _Authentication_;
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

controller.$inject = ['monadLanguageService', 'Authentication'];

export default angular.module('monad.components.footer', ['monad.cms'])
    .component('monadFooter', {
        templateUrl: 'Monad/components/Footer/template.html',
        controller
    })
    .name;

