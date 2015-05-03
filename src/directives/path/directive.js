
"use strict";

export default ['$routeParams', '$route', ($routeParams, $route) => {

    function found(element, path, args) {
        for (let a in args) {
            path = path.replace(':' + a, args[a]);
        }
        element.attr('href', '#' + path.replace(/^#/, ''));
    };

    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            if (!(attrs.moPath)) {
                return;
            }
            let path = scope.$eval(attrs.moPath);
            if (!path) {
                return;
            }
            let args = attrs['arguments'] ? scope.$eval(attrs['arguments']) : {};
            args.language = args.language || $routeParams.language;
            for (let _path in $route.routes) {
                let _pC = ($route.routes[_path].controller || '') + '';
                if (_pC.toLowerCase() == path.toLowerCase()) {
                    return found(element, _path, args);
                }
            }
            return found(element, path, args);
        }
    };
}];

