
"use strict";

/**
 * Skeleton template ("interface") for Authentication services.
 */
export default class Authentication {

    /**
     * _Must_ return a promise checking the current authentication status.
     *
     * @return promise
     */
    ['status']() {
        throw "Authentication.status must be replaced by your custom implementation.";
    }
    
    /**
     * _Must_ attempt to login a user. The default for generic login is to
     * `username` and `password` credentials, but by overriding the login
     * template you can implement whatever login scheme you need.
     *
     * @param object credentials Hash of credentials.
     * @return promise
     */
    attempt(username, password) {
        throw "Authentication.attempt must be replaced by your custom implementation.";
    }
    
    /**
     * _Must_ revoke the current user's rights, either on the current component
     * or globally (depending on situation/application needs).
     *
     * @return promise
     */
    revoke() {
        throw "Authentication.revoke must be replaced by your custom implementation.";
    }
    
    /**
     * _Must_ return true (authenticated) or false (not authenticated)
     *  depending on your implementation and the user's status.
     */
    get check() {
        throw "Authentication.check must be replaced by your custom implementation.";
    }

};

