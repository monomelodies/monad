
"use strict";

let service = undefined;
let loc = undefined;
let language = undefined;

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

