
"use strict";

let service;
let loc;

class LoginController {

    constructor($location, Auth) {
        service = Auth;
        loc = $location;
    }

    attempt(language) {
        service.login(this.username, this.password).success(result => {
            loc.path('/' + language + '/');
        });
    }

};

LoginController.$inject = ['$location', 'moAuthentication'];

export {LoginController};

