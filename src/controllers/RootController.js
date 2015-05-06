
"use strict";

let loc;
let auth;
let nav;
let route;
let modal;

class RootController {

    constructor($location, $rootScope, $route, $translate, $translatePartialLoader, Authentication, Navigation, $modal) {
        loc = $location;
        auth = Authentication;
        nav = Navigation;
        modal = $modal;
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
        this.Navigation.register('main', '/', 'Site');
        $rootScope.$on('$routeChangeStart', () => this.Authentication.read().success(result => {
            if (!this.Authentication.isAuthenticated() && this.loginRequired) {
                loc.path('/' + this.language + '/login/');
            }
        }));
        $rootScope.$on('$routeChangeSuccess', (event, target) => {
            if (target.params.language && target.params.language != this.language) {
                this.language = target.params.language;
                $translate.refresh();
            }
            if (!this.language) {
                loc.path('/en/');
            }
            $translate.use(this.language);
        });
        route = $route;
        $translatePartialLoader.addPart('monad/src');
    }

    get Authentication() {
        return auth;
    }

    get Navigation() {
        return nav;
    }

    logout() {
        this.Authentication.logout().success(() => loc.path('/' + this.language + '/login/'));
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

    license() {
        let m = modal.open({
            template: `
<div class="modal-header">
    <h3 class="modal-title">{{'monad.license' | translate}}</h3>
</div>
<div class="modal-body" ng-include="'monad/LICENSE'"></div>
<div class="modal-footer">
    <button class="btn btn-primary" ng-click="ok()">OK</button>
</div>`,
            controller: ['$scope', '$modalInstance', ($scope, $modalInstance) => {
                $scope.ok = $modalInstance.close;
            }]
        });
    }

};

RootController.$inject = ['$location', '$rootScope', '$route', '$translate', '$translatePartialLoader', 'moAuthentication', 'moNavigation', '$modal'];

export {RootController};

