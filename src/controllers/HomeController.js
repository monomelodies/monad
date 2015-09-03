
"use strict";

/**
 * The default home page controller. You might want to extend/override this to
 * actually do something useful (like showing a dashboard).
 */
export default class HomeController
{
    /**
     * Class constructor. Will redirect to login if global authentication fails.
     *
     * @param Authentication Authentication Injected global authentication
     *  service.
     * @return void
     */
    constructor(Authentication)
    {
        if (!Authentication.check) {
            Authentication.missing();
        }
    }
}

HomeController.$inject = ['Authentication'];

