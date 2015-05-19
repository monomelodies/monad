
"use strict";

let loc;
let auth;
let nav;
let route;
let modal;
let langs;

class RootController {

    constructor($location, $rootScope, $route, $translate, Authentication, Navigation, $modal, title, languages, theme) {
        loc = $location;
        auth = Authentication;
        nav = Navigation;
        modal = $modal;
        this.title = title;
        let reload = $route.reload;
        $route.reload = () => {
            this.modal = false;
            reload();
        };
        this.loginRequired = this.loginRequired || true;
        this.language = undefined;
        langs = languages;
        this.theme = theme;
        Navigation.current();
        $rootScope.$on('$routeChangeStart', () => this.Authentication.read().success(result => {
            if (!this.Authentication.isAuthenticated() && this.loginRequired) {
                loc.path('/' + (this.language || languages[0]) + '/login/');
            }
        }));
        $rootScope.$on('$routeChangeSuccess', (event, target) => {
            if (target.params.language && target.params.language != this.language) {
                this.language = target.params.language;
                $translate.refresh();
            }
            if (!this.language) {
                loc.path('/' + languages[0] + '/');
            }
            $translate.use(this.language);
        });
        route = $route;
    }

    get Authentication() {
        return auth;
    }

    get Navigation() {
        return nav;
    }

    get languages() {
        return langs;
    }

    logout() {
        this.Authentication.logout().success(() => loc.path('/' + this.language + '/login/'));
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
<div class="modal-body" ng-include="'../monad/license.html'"></div>
<div class="modal-footer">
    <button class="btn btn-primary" ng-click="ok()">OK</button>
</div>`,
            controller: ['$scope', '$modalInstance', ($scope, $modalInstance) => {
                $scope.ok = $modalInstance.close;
            }]
        });
    }

};

RootController.$inject = ['$location', '$rootScope', '$route', '$translate', 'moAuthentication', 'moNavigation', '$modal', 'title', 'languages', 'theme'];

export {RootController};

