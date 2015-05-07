
"use strict";

export default ['$route', $route => {

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
            if ($route.current && $route.current.params && $route.current.params.language) {
                args.language = args.language || $route.current.params.language;
            } else {
                args.language = args.language || 'en';
            }
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

