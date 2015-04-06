
"use strict";

class ListController {

    constructor(module, Service, Model, $routeParams) {
        this.module = module;
        this.Service = Service;
        this.Model = Model;
        this.page($routeParams);
    }

    page(params) {
        this.Service.list(params).success(items => this.items = items);
    }
};

ListController.$inject = ['module', 'Service', 'Model', '$routeParams'];

export {ListController};

