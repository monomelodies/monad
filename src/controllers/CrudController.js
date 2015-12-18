
"use strict";

import Component from '../classes/Component';
import Collection from '../classes/Collection';
import Model from '../classes/Model';
import Manager from '../services/Manager';

let route = undefined;
let modal = undefined;
let loc = undefined;
let q = undefined;
let report = undefined;
let gettextCatalog = undefined;

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
     * @param object $q Angular $q service.
     * @param object gettextCatalog angular-gettext service.
     * @param object moReport Monad report service.
     * @return void
     */
    constructor($route, $modal, $location, $q, gtc, moReport) {
        route = $route;
        modal = $modal;
        loc = $location;
        q = $q;
        gettextCatalog = gtc;
        report = moReport;

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
     * Save the current model object back to an API using its Manager.
     *
     * @return void
     */
    save() {
        let promises = [];
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
                    promises.push(this[this.$mapping[model]].save(item));
                });
                remove.map(index => this[model].splice(index, 1));
            } else if (this[model] instanceof Model) {
                promises.push(this[this.$mapping[model]].save(this[model]));
            }
        }
        report.add('primary', gettextCatalog.getString('Saving...'), q.all(promises).then(() => { route.reset(); }));
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

    /**
     * Returns true if any model on this CRUD controller is dirty.
     *
     * @return boolean True if anything is dirty, false if all are pristine.
     */
    get $dirty() {
        for (let model in this.$mapping) {
            if (this[model].$dirty) {
                return true;
            }
        }
        return false;
    }

};

CrudController.$inject = ['$route', '$uibModal', '$location', '$q', 'gettextCatalog', 'moReport'];

