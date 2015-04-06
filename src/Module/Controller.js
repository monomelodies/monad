
/**
 * Monad/Home
 */

"use strict";

class Controller
{
    constructor(module, Model, Service, $routeParams)
    {
        this.module = module;
        this.Model = Model;
        this.Service = Service;
        this.data = Service.find($routeParams);
    }
}

Controller.$inject = ['module', 'Model', 'Service', '$routeParams'];

export { Controller };

