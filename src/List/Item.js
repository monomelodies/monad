
"use strict";

import {Module} from '../../Module';
import {ItemController} from './ItemController';

let injector;

class Item {

    constructor() {
        this.restrict = 'EA';
        this.replace = true;
        this.scope = {data: '=', schema: '=', app: '=', url: '='};
        this.items = undefined;
        this.templateUrl = 'monad/src/Data/List/item.html';
        this.controllerAs = 'item';
        this.bindToController = true;
    }

    get controller() {
        return ['$scope', $scope => {
            let mod = Module.retrieve($scope.item.app);
            let ctrl = injector.instantiate(mod.list && mod.list.ItemController || ItemController);
            for (let key in $scope.item) {
                if (!ctrl[key]) {
                    ctrl[key] = $scope.item[key];
                }
            }
            return ctrl;
        }];
    }

    static factory($injector) {
        injector = $injector;
        Item.instance = new Item();
        return Item.instance;
    }
};

Item.factory.$inject = ['$injector'];

export {Item};

