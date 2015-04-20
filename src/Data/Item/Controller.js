
"use strict";

import {Controller as List} from '../List/Controller';

let route;

class Controller extends List {

    constructor(Module, Model, Service, $routeParams, $route, $injector) {
        super(Module, Model, Service, $routeParams, $route, $injector);
        this.Service.find($routeParams).success(item => this.Model = $injector.instantiate(this.Meta).$load(item));
        route = $route;
    }

    page() {
    }

    update() {
        this.Model.$update().success(() => route.reload());
    }

};

export {Controller};

