
"use strict";

let service;
let loc;

class LoginController {

    constructor(AuthenticationService, $location) {
        service = AuthenticationService;
        loc = $location;
    }

    attempt(language) {
        service.login(this.username, this.password).success(result => {
            loc.path('/' + language + '/');
        });
    }

};

LoginController.$inject = ['Authentication.Service', '$location'];

export {LoginController};

