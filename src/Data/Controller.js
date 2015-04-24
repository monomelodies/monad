
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

    create(item) {
        let result;
        console.log(item);
        if (result = this.Repository.create(item)) {
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

};

Controller.$inject = ['Module', '$routeParams', '$route', '$injector'];

export {Controller};

