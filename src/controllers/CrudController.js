
"use strict";

import {Component} from '../classes/Component';

let route;
let modal;
let loc;

class CrudController {

    constructor($route, $modal, $location) {
        route = $route;
        modal = $modal;
        loc = $location;
        if ($route.current && $route.current.locals) {
            for (let p in $route.current.locals) {
                if (p.substring(0, 1) == '$') {
                    continue;
                }
                this[p] = $route.current.locals[p];
            }
        }
        switch ($route.current.params.id) {
            case 'create':
                this.item = new this.Manager.model();
                break;
            default:
                this.Manager.find($route.current.params).success(item => this.item = item);
        }
    }

    save() {
        let result;
        if (this.item.$new) {
            this.Manager.create(this.item).success(() => loc.path(loc.path().replace(/\/create\//, '/')));
        } else if (this.item.$dirty) {
            this.Manager.update(this.item).success(this.reload);
        }
    }

    ['delete']() {
        let modalInstance = modal.open({
            template: `<div class="modal-header"><h3 class="modal-title">{{'monad.delete.title' | translate}}</h3></div>
                            <div class="modal-body">
                            {{'monad.delete.body' | translate}}
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" ng-click="ok(monad.language)">{{'monad.delete.ok' | translate}}</button>
                            <button class="btn btn-warning" ng-click="cancel()">{{'monad.delete.cancel' | translate}}</button>
                        </div>`,
            controller: ['$scope', '$modalInstance', ($scope, $modalInstance) => {
                $scope.ok = language => {
                    this.Manager['delete'](this.item);
                    $modalInstance.close(this.item);
                    loc.path(Component.get(this.module).paths.list.replace(/:language/, language));
                    route.reload();
                };
                $scope.cancel = () => {
                    $modalInstance.dismiss('cancel');
                };
            }]
        });
    }

    reload() {
        route.reload();
    }

};

CrudController.$inject = ['$route', '$modal', '$location'];

export {CrudController};

