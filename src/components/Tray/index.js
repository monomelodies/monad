
"use strict";

class controller {

    get data() {
        return this._msg.scope;
    }

}

export default angular.module('monad.cms.tray', ['monad.cms'])
    .component('monadTray', {
        templateUrl: 'Monad/components/Tray/template.html'
    })
    .directive('monadMessage', ['$compile', $compile => ({
        restrict: 'E',
        controller,
        controllerAs: 'msg',
        bindToController: true,
        scope: {_msg: '=data'},
        link: (scope, elem, attrs) => {
            let html = angular.element('<div>' + scope.msg._msg.body + '</div>');
            elem.append($compile(html)(scope));
        }
    })])
    .name;
