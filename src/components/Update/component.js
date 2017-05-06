
"use strict";

let gettext = undefined;
let $q = undefined;
let moReport = undefined;
let $route = undefined;
let $location = undefined;
let moLanguage = undefined;
let moProgress = undefined;

class controller {

    constructor(_gettext_, _$q_, _moReport_, _$route_, _$location_, _moLanguage_, moDelete, _moProgress_) {
        gettext = _gettext_;
        $q = _$q_;
        moReport = _moReport_;
        $route = _$route_;
        $location = _$location_;
        moLanguage = _moLanguage_;
        moProgress = _moProgress_
        this['delete'] = (item, newurl) => {
            moDelete.ask(item, newurl);
        };
        this.creating = false;
        if (typeof this.data.item == 'function') {
            this.creating = true;
            this.data.item = new this.data.item;
        }
        let data = undefined;
        if (data = $location.search().data) {
            data = angular.fromJson(data);
            for (let prop in data) {
                if (this.data[prop] != undefined) {
                    for (let sub in data[prop]) {
                        if (this.data[prop][sub] == undefined) {
                            this.data[prop][sub] = data[prop][sub];
                        }
                    }
                    this.data[prop].$markClean();
                }
            }
        }
    }

    save() {

        function $save(item) {
            if (angular.isArray(item)) {
                item.$save(true);
                return;
            }
            if (item.$deleted && item.$deleted()) {
                moProgress.schedule(item, '$delete');
            } else if (item.$dirty && item.$dirty()) {
                moProgress.schedule(item, '$save');
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
            moProgress.run().then(() => {
                $route.reset();
                if (this.creating) {
                    $location.path(moLanguage.current + this.list);
                }
            })
        );
    }

    ['$dirty']() {
        for (let i in this.data) {
            if (this.data[i] == undefined) {
                // A resolving promise, so ignore (it'll show up on the next iteration)
                continue;
            }
            if (angular.isArray(this.data[i])) {
                for (let j = 0; j < this.data[i].length; j++) {
                    // Deleted, dirty or new
                    if (this.data[i][j].$deleted() || this.data[i][j].$dirty() || !('$save' in this.data[i][j])) {
                        return true;
                    }
                }
            } else if (this.data[i].$deleted() || this.data[i].$dirty()) {
                return true;
            }
        }
        return false;
    }

}

controller.$inject = ['gettext', '$q', 'moReport', '$route', '$location', 'moLanguage', 'moDelete', 'moProgress'];

export default angular.module('monad.components.update', ['monad.cms'])
    .component('moUpdate', {
        templateUrl: '/monad/components/Update/template.html',
        transclude: true,
        bindings: {data: '=', list: '@', type: '@', title: '@'},
        controller
    })
    .name
    ;

