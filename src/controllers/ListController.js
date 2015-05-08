
"use strict";

let params;
let route;
let modal;

class ListController {

    constructor($route, $translatePartialLoader, $modal) {
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
        params = $route.current.params;
        modal = $modal;
        route = $route;
        this.page = params.page || 1;
    }

    reload() {
        route.reload();
    }

    get page() {
        return this._page;
    }

    set page(page) {
        this._page = page;
        while (this.items.length) {
            this.items.pop();
        }
        this.Manager.list(params, {offset: (page - 1) * 10}).success(items => items.map(item => this.items.push(item)));
    };

    /**
     * Method allowing item deletion directly from a list:
     */
    ['delete'](item) {
        let modalInstance = modal.open({
            template: `<div class="modal-header"><h3 class="modal-title">{{'monad.delete.title' | translate}}</h3></div>
<div class="modal-body">
    {{'monad.delete.body' | translate}}
</div>
<div class="modal-footer">
    <button class="btn btn-primary" ng-click="ok()">{{'monad.delete.ok' | translate}}</button>
    <button class="btn btn-warning" ng-click="cancel()">{{'monad.delete.cancel' | translate}}</button>
</div>`,
            controller: ['$scope', '$modalInstance', ($scope, $modalInstance) => {
                $scope.ok = () => {
                    this.Manager['delete'](item);
                    $modalInstance.close(item);
                    route.reload();
                };
                $scope.cancel = () => {
                    $modalInstance.dismiss('cancel');
                };
            }]
        });
    }

};

ListController.$inject = ['$route', '$translatePartialLoader', '$modal'];

export {ListController};

