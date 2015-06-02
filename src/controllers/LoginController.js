
"use strict";

let service;
let loc;
let language;

class LoginController {

    constructor($location, Auth, moLanguage) {
        service = Auth;
        loc = $location;
        language = moLanguage;
        this.credentials = [];
    }

    attempt() {
        service.attempt(...this.credentials).success(result => {
            loc.path('/' + language.current + '/');
        });
    }

};

LoginController.$inject = ['$location', 'Authentication', 'moLanguage'];

export {LoginController};

