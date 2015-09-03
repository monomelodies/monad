
"use strict";

export default class HomeController
{
    constructor(Authentication)
    {
        if (!Authentication.check) {
            Authentication.missing();
        }
    }
}

HomeController.$inject = ['Authentication'];

