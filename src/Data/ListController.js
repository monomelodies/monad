
"use strict";

class ListController {

    constructor(app, Module, $routeParams) {
        this.app = app;
        var elements = Module.retrieve(app);
        for (let name in elements) {
            this[name] = elements[name];
        }
        this.items = [];
        this.page($routeParams);
    }

    page(params) {
        this.Service.list(params).success(items => this.items = items);
    }
};

ListController.$inject = ['app', 'Module', '$routeParams'];

export {ListController};

