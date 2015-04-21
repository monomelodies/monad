
"use strict";

let route;
let injector;

class Controller {

    constructor(Module, $routeParams, $route, $injector) {
        for (let key in Module) {
            try {
                this[key] = $injector.instantiate(Module[key]);
            } catch (e) {
                this[key] = Module[key];
            }
        }
        route = $route;
        injector = $injector;
    }

    reload() {
        route.reload();
    }

    instantiate(something) {
        return injector.instantiate(something);
    }

};

Controller.$inject = ['Module', '$routeParams', '$route', '$injector'];

export {Controller};

