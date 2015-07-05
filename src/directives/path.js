
"use strict";

export default ['$route', '$location', 'moLanguage', ($route, $location, Language) => {

    function found(element, path, args) {
        for (let a in args) {
            path = path.replace(':' + a, args[a]);
        }
        element.attr('href', '#' + path.replace(/^#/, ''));
    };

    return {
        restrict: 'A',
        link: (scope, element, attrs) => {
            element.on('click', $event => {
                let t = element.text();
                if (!t.match(/\s/) && t.match(/^https?:\/\//)) {
                    window.open(t);
                    $event.stopPropagation();
                    return false;
                } else {
                    return true;
                }
            });
            let params = $route.current ? $route.current.params : {};
            let original = $route.current ? $route.current.originalPath : $location.path().replace(/^\/[a-z]{2}\//, '/:language/');
            let path = attrs.moPath || original;
            if (!path) {
                return;
            }
            let args = attrs['arguments'] ? scope.$eval(attrs['arguments']) : {};
            if (params.language) {
                args.language = args.language || params.language;
            } else {
                args.language = args.language || Language.current;
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

