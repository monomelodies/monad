
"use strict";

let monadLanguageService = undefined;

class controller {

    constructor(_monadLanguageService_, languages, Authentication) {
        monadLanguageService = _monadLanguageService_;
        this.languages = language;
        this.authenticated = Authentication.check;
        console.log(Authentication, this.authenticated);
    }

    get language() {
        return monadLanguageService.current;
    }

};

controller.$inject = ['monadLanguageService', 'languages'];

export default angular.module('monad.components.footer', ['monad.cms'])
    .component('monadFooter', {
        templateUrl: 'Monad/components/Footer/template.html',
        controller
    })
    .name;

