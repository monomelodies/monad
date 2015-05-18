
"use strict";

class HomeController
{
    constructor($http)
    {
        this.dashboard = '../monad/templates/dashboard.html';
    }
}

HomeController.$inject = ['$http'];

export { HomeController };

