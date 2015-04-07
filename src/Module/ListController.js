
"use strict";

class ListController {

    constructor(app, Module, $routeParams) {
        this.app = app;
        var elements = Module.retrieve(app);
        console.log(elements);
        for (let name in elements) {
            console.log(name, elements[name]);
            this[name] = elements[name];
        }
        console.log(this);
        this.page($routeParams);
    }

    page(params) {
        this.Service.list(params).success(items => this.items = items);
    }
};

ListController.$inject = ['app', 'Module.Service', '$routeParams'];

export {ListController};

