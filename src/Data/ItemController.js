
"use strict";

import {ListController} from './ListController';

class ItemController extends ListController {

    constructor(app, Module, $routeParams, $injector) {
        super(app, Module, $routeParams, $injector);
        this.Service.find($routeParams).success(item => this.Model = $injector.instantiate(this.Meta).$load(item));
    }

    page() {
    }

};

ItemController.$inject = ['app', 'Module', '$routeParams', '$injector'];

export {ItemController};

