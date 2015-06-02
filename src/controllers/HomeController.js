
"use strict";

class HomeController
{
    constructor(Authentication)
    {
        if (!Authentication.check()) {
            Authentication.missing();
        }
    }
}

HomeController.$inject = ['Authentication'];

export { HomeController };

