
"use strict";

export class Authentication {

    ['status']() {
        throw "Authentication.status must be replaced by your custom implementation.";
    }
    
    missing() {
        throw "Authentication.missing must be replaced by your custom implementation.";
    }

    attempt(username, password) {
        throw "Authentication.attempt must be replaced by your custom implementation.";
    }
    
    revoke() {
        throw "Authentication.revoke must be replaced by your custom implementation.";
    }
    
    check() {
        throw "Authentication.check must be replaced by your custom implementation.";
    }

};

