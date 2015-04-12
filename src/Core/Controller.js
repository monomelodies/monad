
"use strict";

let route;
let auth;
let loc;

class Controller {

    constructor(Authentication, $location, $rootScope, $route, $translate) {
        auth = Authentication;
        loc = $location;
        this.title = 'Default generic administrator';
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
        this.config();
        this.navigation.main.map(item => item.selected = item.url != '/' && ('#' + $location.path()).indexOf(item.url) != -1);
    }

    get Authentication() {
        return auth;
    }

    /**
     * This is for overriding in an extending root controller, so we don't
     * have to remember to re-inject all dependencies which would suck
     * pretty badly.
     */
    config() {
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

};

Controller.$inject = ['monad.Authentication.Service', '$location', '$rootScope', '$route', '$translate'];

export {Controller};

