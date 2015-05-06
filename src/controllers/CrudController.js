
"use strict";

let route;

class CrudController {

    constructor($route, $routeParams, $translate, $translatePartialLoader) {
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
        $translate.refresh();
        switch ($routeParams.id) {
            case 'create':
                this.item = new this.Manager.model();
                break;
            default:
                this.Manager.find($routeParams).success(item => this.item = item);
        }
    }

    save(item) {
        let result;
        if (item.$new) {
            result = this.Manager.create(item);
        } else if (item.$deleted) {
            result = this.Manager['delete'](item);
        } else if (item.$dirty) {
            result = this.Manager.update(item);
        }
        if (result) {
            result.success(this.reload);
        }
    }

    reload() {
        route.reload();
    }

};

CrudController.$inject = ['$route', '$routeParams', '$translate', '$translatePartialLoader'];

export {CrudController};

