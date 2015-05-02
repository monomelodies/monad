
"use strict";

class HomeController
{
    constructor($http)
    {
        this.dashboard = 'monad/template/dashboard.html';
    }
}

HomeController.$inject = ['$http'];

export { HomeController };

