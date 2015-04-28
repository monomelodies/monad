
"use strict";

let route;
let auth;
let loc;

class Controller {

    constructor($location, $rootScope, $route, $translate) {
        auth = angular.injector(['monad.Authentication']).get('Service');
        loc = $location;
        this.title = 'Default generic administrator';
        let reload = $route.reload;
        $route.reload = () => {
            this.modal = false;
            reload();
        };
        this.loginRequired = this.loginRequired || true;
        this.language = 'en';
        this.paths = {
            root: '/monad/',
            theme: 'monad/dist/default.css'
        };
        this.navigation = {
            main: [
                {url: '/', title: 'Site'}
            ]
        };
        $rootScope.$on('$routeChangeStart', () => this.Authentication.read().success(result => {
            if (!this.Authentication.isAuthenticated() && this.loginRequired) {
                loc.path('/' + this.language + '/login/');
            }
        }));
        $rootScope.$on('$routeChangeSuccess', (event, target) => {
            this.language = target.params.language;
            if (!this.language) {
                loc.path('/en/');
            }
            $translate.use(this.language);
        });
        route = $route;
    }

    setSelected() {
        this.navigation.main.map(item => item.selected = item.url != '/' && ('#' + $location.path()).indexOf(item.url) != -1);
    }

    get Authentication() {
        return auth;
    }

    logout() {
        this.Authentication.logout().success(() => loc.path('/' + this.language + '/login/'));
    }        

    select(menu, item = {}) {
        this.navigation[menu].map(item => item.selected = false);
        item.selected = true;
    }

    path(controller, params = {}) {
        params.language = params.language || this.language;
        for (let path in route.routes) {
            let pathController = route.routes[path].controller;
            if (pathController == controller) {
                let result = path;
                for (let param in params) {
                    result = result.replace(':' + param, params[param]);
                }
                return '#' + result.replace(/^#/, '');
            }
        }
        let result = controller;
        for (let param in params) {
            result = result.replace(':' + param, params[param]);
        }
        return '#' + result.replace(/^#/, '');
    }

    url() {
        return loc.path();
    }

    reload() {
        route.reload();
    }

};

Controller.$inject = ['$location', '$rootScope', '$route', '$translate'];

export {Controller};

