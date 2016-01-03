
"use strict";

/**
 * Skeleton template ("interface") for Authentication services.
 */
export default class Authentication {

    /**
     * _Should_ return a promise checking the current authentication status.
     */
    ['status']() {
        throw "Authentication.status must be replaced by your custom implementation.";
    }
    
    /**
     * _Should_ attempt to login a user. Username/password is an example, you
     * can implement whatever login scheme you need.
     *
     * @param string username Example username parameter.
     * @param string password Example password parameter.
     */
    attempt(username, password) {
        throw "Authentication.attempt must be replaced by your custom implementation.";
    }
    
    /**
     * _Should_ revoke the current user's rights.
     */
    revoke() {
        throw "Authentication.revoke must be replaced by your custom implementation.";
    }
    
    /**
     * _Should_ return true (authenticated) or false (not authenticated)
     *  depending on your implementation and the user's status.
     */
    get check() {
        throw "Authentication.check must be replaced by your custom implementation.";
    }

};

