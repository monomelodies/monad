
"use strict";

let route;
let injector;

class Controller {

    constructor(Module, $routeParams, $route, $injector) {
        for (let key in Module) {
            if (['Repository'].indexOf(key) != -1) {
                this[key] = $injector.instantiate(Module[key]);
            } else {
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

