
"use strict";

import Model from '../../Model';

let gettext = undefined;
let $q = undefined;
let moReport = undefined;
let $route = undefined;
let $location = undefined;
let moLanguage = undefined;

class controller {

    constructor(_gettext, _$q, _moReport, _$route, _$location, _moLanguage, moDelete) {
        gettext = _gettext;
        $q = _$q;
        moReport = _moReport;
        $route = _$route;
        $location = _$location;
        moLanguage = _moLanguage;
        this['delete'] = () => {
            moDelete.ask(this.data.item, this.list);
        };
    }

    save() {
        let promise = $q.defer();
        let operations = 0;
        this.progress = 0;
        let done = 0;
        let isNew = !this.data.item.$delete;
        let progress = () => {
            done++;
            this.progress = (done / operations) * 100;
            if (done == operations) {
                promise.resolve('ok');
                $route.reset();
                if (isNew) {
                    $location.path(moLanguage.current + this.list);
                }
            }
        };

        function $save(item) {
            if (angular.isArray(item)) {
                item.map($save);
            } else if (item instanceof Model) {
                if (item.$deleted) {
                    operations++;
                    item.$delete(progress);
                } else if (!item.id || item.$dirty) {
                    operations++;
                    item.$save(progress);
                }
            }
        };

        for (let i in this.data) {
            $save(this.data[i]);
        }
        moReport.add(
            'info',
            '<p style="text-align: center" translate>' + gettext('Saving...') + '</p>' +
            '<uib-progressbar type="info" class="progress-striped" value="msg.data.progress"></uib-progressbar>',
            this,
            promise
        );
    }

    get ['$dirty']() {
            for (let i in this.data) {
                if (angular.isArray(this.data[i])) {
                    for (let j = 0; j < this.data[i].length; j++) {
                        // Deleted, dirty or new
                        if (this.data[i][j].$deleted || this.data[i][j].$dirty || !('$save' in this.data[i][j])) {
                            return true;
                        }
                    }
                } else if (this.data[i].$deleted || this.data[i].$dirty) {
                    return true;
                }
            }
            return false;
    }

}

controller.$inject = ['gettext', '$q', 'moReport', '$route', '$location', 'moLanguage', 'moDelete'];

angular.module('monad.components.update', [])
    .component('moUpdate', {
        templateUrl: '/monad/components/Update/template.html',
        transclude: true,
        bindings: {data: '=', list: '@', type: '@', title: '@'},
        controller
    })
    ;

