
"use strict";

export default ['$compile', $compile => ({
    restrict: 'A',
    controller: function () {},
    controllerAs: 'msg',
    bindToController: true,
    scope: {data: '=scope', body: '='},
    link: (scope, elem, attrs) => {
        elem.html(scope.msg.body).show();
        $compile(elem.contents())(scope)
    }
})];

