
"use strict";

import {Component} from '../classes/Component';

let params = undefined;
let route = undefined;
let modal = undefined;

class ListController {

    constructor($scope, $route, $modal, $injector) {
        if ($route.current && $route.current.locals) {
            for (let p in $route.current.locals) {
                if (p.substring(0, 1) == '$') {
                    continue;
                }
                this[p] = $route.current.locals[p];
            }
        }
        this.$new = new this.Manager.model();
        params = angular.copy($route.current.params);
        delete params.language;
        modal = $modal;
        route = $route;

        if (this.defaultFilter) {
            this.filter = this.defaultFilter;
        }

        this.page = params.page || 1;

        if (!this.Authentication.check) {
            this.Authentication.missing();
        }

        $scope.$watch('list.filter', newvalue => {
            this.page = 1;
            this.Manager.filter = newvalue;
            delete this.Manager.$count;
        }, true);
    }

    reset() {
        route.reset();
        this.page = this._page;
    }

    get page() {
        return this._page;
    }

    set page(page) {
        this._page = page;
        this.Manager.filter = this.filter;
        delete this.Manager.$count;
        this.Manager.paginate(page, params).success(items => this.items = items);
    }

};

ListController.$inject = ['$scope', '$route', '$modal', '$injector'];

export {ListController};

