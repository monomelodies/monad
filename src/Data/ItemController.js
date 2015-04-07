
"use strict";

import {ListController} from './ListController';

class ItemController extends ListController {

    constructor(app, Module, $routeParams) {
        super(app, Module, $routeParams);
        this.Service.find($routeParams).success(item => this.item = item);
    }

    page() {
    }

};

ItemController.$inject = ['app', 'Module', '$routeParams'];

export {ItemController};

