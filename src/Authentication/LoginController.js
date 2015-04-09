
"use strict";

let service;
let loc;

class LoginController {

    constructor(AuthenticationService, $location) {
        service = AuthenticationService;
        loc = $location;
    }

    attempt() {
        service.login(this.username, this.password).success(result => {
            loc.path('/' + this.language + '/');
        });
    }

};

LoginController.$inject = ['Authentication.Service', '$location'];

export {LoginController};

