
"use strict";

let route;

class CrudController {

    constructor($route, $routeParams, $translatePartialLoader) {
        route = $route;
        if ($route.current && $route.current.locals) {
            for (let p in $route.current.locals) {
                if (p.substring(0, 1) == '$') {
                    continue;
                }
                this[p] = $route.current.locals[p];
            }
        }
        $translatePartialLoader.addPart(this.module);
        switch ($routeParams.id) {
            case 'create':
                this.item = new this.Manager.model();
                break;
            default:
                this.Manager.find($routeParams).success(item => this.item = item);
        }
    }

    save() {
        let result;
        if (this.item.$new) {
            result = this.Manager.create(this.item);
        } else if (this.item.$deleted) {
            result = this.Manager['delete'](this.item);
        } else if (this.item.$dirty) {
            result = this.Manager.update(this.item);
        }
        if (result) {
            result.success(this.reload);
        }
    }

    reload() {
        route.reload();
    }

};

CrudController.$inject = ['$route', '$routeParams', '$translatePartialLoader'];

export {CrudController};

