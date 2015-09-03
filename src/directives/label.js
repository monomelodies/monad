
"use strict";

export default () => {
    return {
        restrict: 'EA',
        scope: {item: '='},
        template: `<span ng-bind-html="menu.label"></span>`,
        controller,
        controllerAs: 'menu',
        bindToController: true
    };
};

class controller {

    constructor($http) {
        $http.get(this.item.component + '/menu.html').success(html => {
            this.label = html;
        }).error(err => {
            this.label = this.item.component;
        });
    }

}

controller.$inject = ['$http'];

