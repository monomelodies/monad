
"use strict";

let service;
let loc;
let language;

class LoginController {

    constructor($location, Auth, moLanguage) {
        service = Auth;
        loc = $location;
        language = moLanguage;
    }

    attempt() {
        service.login(this.username, this.password).success(result => {
            loc.path('/' + language.current + '/');
        });
    }

};

LoginController.$inject = ['$location', 'moAuthentication', 'moLanguage'];

export {LoginController};

