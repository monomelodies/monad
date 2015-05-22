
"use strict";

export class Authentication {

    read() {
        throw "Authentication.read must be replaced by your custom implementation.";
    }
    
    login(username, password) {
        throw "Authentication.login must be replaced by your custom implementation.";
    }
    
    logout() {
        throw "Authentication.logout must be replaced by your custom implementation.";
    }
    
    isAuthenticated() {
        return false;
    }

};

