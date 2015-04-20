
"use strict";

let service;
let loc;

class LoginController {

    constructor($location) {
        service = angular.injector(['monad.Authentication']).get('Service');
        loc = $location;
    }

    attempt(language) {
        service.login(this.username, this.password).success(result => {
            loc.path('/' + language + '/');
        });
    }

};

LoginController.$inject = ['$location'];

export {LoginController};

