
"use strict";

import Component from '../classes/Component';
import Collection from '../classes/Collection';
import Model from '../classes/Model';
import Manager from '../services/Manager';

let route = undefined;
let modal = undefined;
let loc = undefined;
let Language = undefined;

/**
 * Default controller to provide CRUD operations on a Component model.
 */
export default class CrudController {

    /**
     * Class constructor. Will redirect to login if authentication fails.
     *
     * @param object $route Angular $route service.
     * @param object $modal Bootstrap $modal service.
     * @param object $location Angular $location service.
     * @param Language moLanguage Monad Language service.
     * @return void
     */
    constructor($route, $modal, $location, moLanguage) {
        route = $route;
        modal = $modal;
        loc = $location;
        Language = moLanguage;

        if ($route.current && $route.current.locals) {
            for (let p in $route.current.locals) {
                if (p.substring(0, 1) == '$' && p != '$mapping') {
                    continue;
                }
                this[p] = $route.current.locals[p];
            }
        }

        if (!this.Authentication.check) {
            this.Authentication.missing();
        }
    }

    /**
     * Save the current model object back to an API using its Manager. If the
     * item is being created, redirect to the list if that exists.
     *
     * @return void
     */
    save() {
        let redir = this.item.$new ? this.component.settings.list.url : undefined;
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

    /**
     * Delete the current model (after confirmation) and redirect back to list.
     *
     * @return void
     */
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
                    loc.path(this.component.settings.list.url.replace(/:language/, Language.current));
                };
                $scope.cancel = () => {
                    $modalInstance.dismiss('cancel');
                };
            }]
        });
    }

};

CrudController.$inject = ['$route', '$modal', '$location', 'moLanguage', 'Authentication'];

