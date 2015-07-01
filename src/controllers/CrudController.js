
"use strict";

import {Component} from '../classes/Component';
import {Collection} from '../classes/Collection';
import {Model} from '../classes/Model';
import {Manager} from '../services/Manager';

let route;
let modal;
let loc;
let Language;

class CrudController {

    constructor($route, $modal, $location, moLanguage, $translatePartialLoader, Authentication) {
        route = $route;
        modal = $modal;
        loc = $location;
        Language = moLanguage;

        if (!Authentication.check) {
            Authentication.missing();
        }

        if ($route.current && $route.current.locals) {
            for (let p in $route.current.locals) {
                if (p.substring(0, 1) == '$' && p != '$mapping') {
                    continue;
                }
                this[p] = $route.current.locals[p];
            }
        }
        $translatePartialLoader.addPart(this.module.name);
        this.module.dependencies.map(dep => {
            if (monad.exists(dep)) {
                $translatePartialLoader.addPart(dep);
            }
        });
    }

    save() {
        let redir = this.item.$new ? this.module.settings.list.url : undefined;
        for (let model in this.$mapping) {
            if (!(this[this.$mapping[model]] && this[this.$mapping[model]] instanceof Manager)) {
                continue;
            }
            if (this[model] instanceof Collection) {
                let remove = [];
                this[model].map((item, index) => {
                    if (item.$deleted) {
                        remove.unshift(index);
                    }
                    this[this.$mapping[model]].save(item);
                });
                remove.map(index => this[model].splice(index, 1));
            } else if (this[model] instanceof Model) {
                this[this.$mapping[model]].save(this[model]);
            }
        }
        if (redir) {
            loc.path('/' + Language.current + redir);
        }
        route.reset();
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
                $scope.ok = () => {
                    this.Manager['delete'](this.item);
                    $modalInstance.close(this.item);
                    route.reset();
                    loc.path(this.module.settings.list.url.replace(/:language/, Language.current));
                };
                $scope.cancel = () => {
                    $modalInstance.dismiss('cancel');
                };
            }]
        });
    }

};

CrudController.$inject = ['$route', '$modal', '$location', 'moLanguage', '$translatePartialLoader', 'Authentication'];

export {CrudController};

