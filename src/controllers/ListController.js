
"use strict";

let params;

class ListController {

    constructor($route, $routeParams, $translatePartialLoader) {
        if ($route.current && $route.current.locals) {
            for (let p in $route.current.locals) {
                if (p.substring(0, 1) == '$') {
                    continue;
                }
                this[p] = $route.current.locals[p];
            }
        }
        $translatePartialLoader.addPart(this.module);
        this.$new = new this.Manager.model();
        this.items = [];
        params = $routeParams;
        this.page = params.page || 1;
    }

    get page() {
        return this._page;
    }

    set page(page) {
        console.log(page);
        this._page = page;
        while (this.items.length) {
            this.items.pop();
        }
        this.Manager.list(params, {offset: (page - 1) * 10}).success(items => items.map(item => this.items.push(item)));
    };

};

ListController.$inject = ['$route', '$routeParams', '$translatePartialLoader'];

export {ListController};

