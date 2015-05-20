
"use strict";

let loc;
let auth;
let nav;
let route;
let modal;
let langs;
let editorOptions;

class RootController {

    constructor($location, $rootScope, $route, $translate, Authentication, Navigation, $modal, title, languages, theme, ckeditor) {
        loc = $location;
        auth = Authentication;
        nav = Navigation;
        modal = $modal;
        editorOptions = angular.extend({
            resize_enabled: false,
            bodyClass: 'editable',
            forcePasteAsPlainText: true,
            docType: '<!doctype html>',
            entities: false,
            entities_greek: false,
            toolbar: 'Full',
            disableNativeSpellChecker: true
        }, ckeditor);
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
                editorOptions.language = this.language;
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

    ckeditor(options = {}) {
        console.log(angular.extend({}, editorOptions, options));
        return angular.extend({}, editorOptions, options);
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
                    console.log(result);
                });
                $scope.ok = $modalInstance.close;
            }]
        });
    }

};

RootController.$inject = [
    '$location',
    '$rootScope',
    '$route',
    '$translate',
    'moAuthentication',
    'moNavigation',
    '$modal',
    'title',
    'languages',
    'theme',
    'ckeditor'
];

export {RootController};

