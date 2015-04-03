
"use strict";

class LoginController {

    constructor(AuthenticationService, $location) {
        this.service = AuthenticationService;
        this.location = $location;
    }

    attempt() {
        this.service.login(this.username, this.password).success(result => {
            this.location.path('/');
        });
    }

};

LoginController.$inject = ['AuthenticationService', '$location'];

export {LoginController};

