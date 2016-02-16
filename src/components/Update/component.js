
"use strict";

angular.module('monad.components.update', [])
    .component('moUpdate', {
        templateUrl: '/monad/components/Update/template.html',
        transclude: true,
        bindings: {data: '=', list: '@', type: '@', title: '@'},
        controller: ['gettextCatalog', '$q', 'moReport', '$route', '$timeout', function (gettextCatalog, $q, moReport, $route, $timeout) {
            let pristine = this.data;

            this.save = () => {
                let promise = $q.defer();
                let operations = 0;
                this.progress = 0;
                let done = 0;
                let progress = () => {
                    done++;
                    this.progress = (done / operations) * 100;
                    if (done == operations) {
                        promise.resolve('ok');
                        $route.reset();
                    }
                };

                function saveit(resource = undefined) {
                    return item => {
                        if (angular.isArray(item)) {
                            item.map(saveit(item));
                        } else if (typeof item == 'object') {
                            if (item.$save) {
                                if (item.$deleted) {
                                    operations++;
                                    item.$delete({}, progress);
                                } else {
                                    operations++;
                                    item.$save({}, progress);
                                }
                            } else if (!item.$deleted) {
                                operations++;
                                resource.save(item, progress);
                            }
                        }
                    };
                };

                $timeout(() => {
                    for (let i in this.data) {
                        saveit()(this.data[i]);
                    }
                });
                moReport.add(
                    'info',
                    '<p style="text-align: center">' + gettextCatalog.getString('Saving...') + '</p>' +
                    '<uib-progressbar type="info" class="progress-striped" value="msg.data.progress"></uib-progressbar>',
                    this,
                    promise
                );
            };

            this.$dirty = () => {
                return pristine == this.data;
            };
        }]
    })
    ;

