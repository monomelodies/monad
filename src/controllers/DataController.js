
"use strict";

let route;
let injector;
let manager;

class Controller {

    constructor(Module, Manager, $routeParams, $route, $injector) {
        manager = Manager;
        route = $route;
        injector = $injector;
        this.Module = Module;
    }

    create(item) {
        let result;
        if (result = manager.create(item)) {
            item.$load({});
            result.success(this.reload);
        }
    }

    reload() {
        route.reload();
    }

    instantiate(something) {
        return injector.instantiate(something);
    }

    get manager() {
        return manager;
    }

};

Controller.$inject = ['module', 'Manager', '$routeParams', '$route', '$injector'];

export {Controller};

