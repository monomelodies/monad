
"use strict";

let route;
let injector;
let manager;

class DataController {

    constructor(Module, Manager, $routeParams, $route, $injector, $translate, $translatePartialLoader) {
        manager = Manager;
        route = $route;
        injector = $injector;
        this.Module = Module;
        $translatePartialLoader.addPart(Module);
        $translate.refresh();
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

DataController.$inject = ['module', 'Manager', '$routeParams', '$route', '$injector', '$translate', '$translatePartialLoader'];

export {DataController};

