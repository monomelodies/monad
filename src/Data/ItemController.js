
"use strict";

import {ListController} from './ListController';

class ItemController extends ListController {

    constructor(Module, Model, Service, $routeParams, $route, $injector) {
        super(Module, Model, Service, $routeParams, $route, $injector);
        this.Service.find($routeParams).success(item => this.Model = $injector.instantiate(this.Meta).$load(item));
    }

    page() {
    }

};

export {ItemController};

