
"use strict";

let loc;
let auth;
let nav;
let modal;
let Language;
let editorOptions;

class RootController {

    constructor($location, $rootScope, $translate, $modal, Authentication, Navigation, moLanguage, title, theme, ckeditor) {
        loc = $location;
        auth = Authentication;
        nav = Navigation;
        modal = $modal;
        Language = moLanguage;
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
        this.loginRequired = this.loginRequired || true;
        this.theme = theme;
        Navigation.current();
        $rootScope.$on('$routeChangeStart', () => this.Authentication.read().success(result => {
            if (!this.Authentication.isAuthenticated() && this.loginRequired) {
                loc.path('/' + (Language.current || Language.list[0]) + '/login/');
            }
        }));
        $rootScope.$on('$routeChangeSuccess', (event, target) => {
            if (target.params.language) {
                editorOptions.language = target.params.language;
            }
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

    ckeditor(options = {}) {
        return angular.extend({}, editorOptions, options);
    }

    logout() {
        this.Authentication.logout().success(() => loc.path('/' + this.language + '/login/'));
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
    'moAuthentication',
    'moNavigation',
    'moLanguage',
    'title',
    'theme',
    'ckeditor'
];

export {RootController};

