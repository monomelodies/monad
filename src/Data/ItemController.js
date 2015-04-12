
"use strict";

import {ListController} from './ListController';

let route;

class ItemController extends ListController {

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

export {ItemController};

