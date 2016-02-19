
"use strict";

angular.module('monad.components.list', [])
    .component('moListHeader', {
        transclude: true,
        controller: ['$transclude', function ($transclude) {
            this.transcluded = !!$transclude().length;
        }],
        template: `<h1 class="clearfix">
    <a ng-if="$ctrl.create"
        class="glyphicon glyphicon-plus-sign pull-right"
        title="{{ 'Create' | translate }}"
        ng-href="#/{{ $root.Language.current }}{{ $ctrl.create }}"></a>
    <span ng-transclude></span>
</h1>`,
        bindings: {create: '@'}
    })
    .component('moListTable', {
        transclude: true,
        controller: ['$transclude', '$templateCache', function ($transclude, $templateCache) {
            this.columns = [];
            this.headers = [];
            let hdrs = $transclude().find('th');
            let templates = $transclude().find('td');
            if (hdrs.length) {
                angular.forEach(hdrs, hdr => {
                    this.columns.push(angular.element(hdr).attr('property'));
                    this.headers.push(angular.element(hdr).html());
                });
            } else {
                if (this.rows && this.rows.length) {
                    for (let key in this.rows[0]) {
                        this.columns.push(key);
                    }
                }
            }
            let rowbody = '';
            this.columns.map(col => {
                let custom = $transclude().find('td[property="' + col + '"]');
                let html = custom.html();
                if (!(html && html.length)) {
                    html = `<a ng-href="#/{{ $root.Language.current }}{{ $ctrl.update }}" arguments="row">{{ row.${col} }}</a>`;
                }
                $templateCache.put('/monad/' + col + '.html', html);
            });
        }],
        template: `<table class="table table-striped" ng-show="$ctrl.rows.length">
            <thead><tr>
                <th ng-repeat="header in $ctrl.headers" ng-bind-html="header"></th>
            </tr></thead>
            <tbody>
                <tr ng-repeat="row in $ctrl.rows" ng-if="!row.$deleted">
                    <td ng-repeat="column in $ctrl.columns" ng-include="'/monad/' + column + '.html'"></td>
                </tr>
            </tbody>
        </table>
        <div ng-show="!$ctrl.rows.length">
            <uib-alert type="warning"><span translate>Sorry, nothing found.</span></uib-alert>
        </div>`,
        bindings: {rows: '=', update: '@'}
    })
    ;

