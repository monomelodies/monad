
/**
 * Monad/Home
 */

"use strict";

class Controller
{
    constructor($http)
    {
        this.dashboard = 'monad/template/dashboard.html';
    }
}

Controller.$inject = ['$http'];

export { Controller };

