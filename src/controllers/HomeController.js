
"use strict";

class HomeController
{
    constructor($http)
    {
        this.dashboard = 'monad/src/templates/dashboard.html';
    }
}

HomeController.$inject = ['$http'];

export { HomeController };

