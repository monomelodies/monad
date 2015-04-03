
/**
 * Monad/Home
 */

"use strict";

class Controller
{
    constructor($http)
    {
        this.dashboard = 'monad/src/Home/dashboard.html';
    }
}

Controller.$inject = ['$http'];

export { Controller };

