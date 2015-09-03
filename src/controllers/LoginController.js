
"use strict";

let service = undefined;
let loc = undefined;
let language = undefined;

/**
 * Controller for the login page (global authentication).
 */
export default class LoginController {

    /**
     * Class constructor.
     *
     * @param object $location Injected Angular $location service.
     * @param Authentication Auth Injected Monad Authentication service.
     * @param Language moLanguage Injected Monad Language service.
     * @return void
     */
    constructor($location, Auth, moLanguage) {
        service = Auth;
        loc = $location;
        language = moLanguage;
        /**
         * Array of bindable `credentials`. Since we have no idea what your
         * authentication scheme looks like, you should decide on your own
         * mapping for these (e.g. [0] == username etc.).
         */
        this.credentials = [];
    }

    /**
     * Attempt login using supplied bound `credentials`. Redirects to the home
     * page on success.
     *
     * @return void
     */
    attempt() {
        service.attempt(...this.credentials).success(result => {
            loc.path('/' + language.current + '/');
        });
    }

};

LoginController.$inject = ['$location', 'Authentication', 'moLanguage'];

