
"use strict";

export default ['$compile', $compile => ({
    restrict: 'A',
    controller: function () {},
    controllerAs: 'msg',
    bindToController: true,
    scope: {data: '=scope', body: '='},
    link: (scope, elem, attrs) => {
        let html = angular.element(scope.msg.body);
        elem.append($compile(html)(scope));
    }
})];

