
"use strict";

import {Component} from '../classes/Component';
import {Collection} from '../classes/Collection';
import {Model} from '../classes/Model';
import {Manager} from '../services/Manager';

let route = undefined;
let modal = undefined;
let loc = undefined;
let Language = undefined;

class CrudController {

    constructor($route, $modal, $location, moLanguage, Authentication) {
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
            template: `<div class="modal-header"><h3 class="modal-title" translate>Do you want to delete this?</h3></div>
                        <div class="modal-body" translate>
                            No going back afterwards, so just verifying...
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary" ng-click="ok(monad.language)" translate>Yes, I'm sure</button>
                            <button class="btn btn-warning" ng-click="cancel()" translate>Oopsie, no...</button>
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

CrudController.$inject = ['$route', '$modal', '$location', 'moLanguage', 'Authentication'];

export {CrudController};

