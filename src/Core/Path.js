
"use strict";

let params;
let route;

class Path {

    constructor() {
        this.scope = {monadPath: '=', monadPathArguments: '='};
        this.restrict = 'A';
    }

    link(scope, elem) {
        let p = scope.monadPathArguments;
        p.language = p.language || params.language;
        for (let path in route.routes) {
            let pathController = route.routes[path].controller;
            if (pathController == scope.monadPath) {
                let result = path;
                for (let param in p) {
                    result = result.replace(':' + param, p[param]);
                }
                elem.attr('href', '#' + result.replace(/^#/, ''));
                return;
            }
        }
        let result = scope.monadPath;
        for (let param in p) {
            result = result.replace(':' + param, p[param]);
        }
        elem.attr('href', '#' + result.replace(/^#/, ''));
    }

    static factory($routeParams, $route) {
        params = $routeParams;
        route = $route;
        return new Path();
    }
};

Path.factory.$inject = ['$routeParams', '$route'];

export {Path};

