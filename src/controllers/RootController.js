
"use strict";

let loc;
let auth;
let nav;
let modal;
let Language;

class RootController {

    constructor($location, $rootScope, $translate, $modal, Authentication, Navigation, moLanguage, title, theme) {
        loc = $location;
        auth = Authentication;
        nav = Navigation;
        modal = $modal;
        Language = moLanguage;
        this.title = title;
        this.loginRequired = this.loginRequired || true;
        this.theme = theme;
        Navigation.current();
        $rootScope.$on('$routeChangeStart', () => this.Authentication['status']().success(result => {
            if (!this.Authentication.check() && this.loginRequired) {
                this.Authentication.missing();
            }
        }));
        $rootScope.$on('$routeChangeSuccess', (event, target) => {
            if (!Language.current) {
                loc.path('/' + Language.list[0] + '/');
            }
        });
    }

    get Authentication() {
        return auth;
    }

    get Navigation() {
        return nav;
    }

    get language() {
        return Language.current;
    }

    get languages() {
        return Language.list;
    }

    logout() {
        this.Authentication.revoke().success(() => loc.path('/' + this.language + '/login/'));
    }        

    url() {
        return loc.path();
    }

    license() {
        let m = modal.open({
            template: `
<div class="modal-header">
    <h3 class="modal-title">{{'monad.license' | translate}}</h3>
</div>
<div class="modal-body">
    <p><strong>{{'monad.license.note' | translate}}</strong></p>
    <p ng-repeat="paragraph in paragraphs">{{paragraph}}</p>
</div>
<div class="modal-footer">
    <button class="btn btn-primary" ng-click="ok()">{{'monad.license.ok' | translate}}</button>
</div>`,
            controller: ['$scope', '$modalInstance', '$http', ($scope, $modalInstance, $http) => {
                $http.get('../monad/LICENSE.txt').success(result => {
                    $scope.paragraphs = result.split('\n\n');
                });
                $scope.ok = $modalInstance.close;
            }]
        });
    }

};

RootController.$inject = [
    '$location',
    '$rootScope',
    '$translate',
    '$modal',
    'Authentication',
    'moNavigation',
    'moLanguage',
    'title',
    'theme'
];

export {RootController};

