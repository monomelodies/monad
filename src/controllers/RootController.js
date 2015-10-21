
"use strict";

let loc = undefined;
let auth = undefined;
let nav = undefined;
let modal = undefined;
let Language = undefined;

/**
 * The default RootController as used by Monad. May be overridden by registering
 * a custom `moController` controller on your application.
 */
export default class RootController {

    /**
     * Class constructor.
     *
     * @param object $location Injected Angular $location service.
     * @param object $rootScope Injected Angular $rootScope.
     * @param object $modal Injected Bootstrap $modal service.
     * @param object Authentication Injected global Authentication service.
     * @param object Navigation Injected Monad Navigation service.
     * @param object moLanguage Injected Monad Language service.
     * @param object title Injected Monad `title` value.
     * @param object theme Injected Monad `theme` value.
     * @return void
     */
    constructor($location, $routeParams, $rootScope, $modal, Authentication, Navigation, moLanguage, title, theme) {
        loc = $location;
        auth = Authentication;
        nav = Navigation;
        modal = $modal;
        Language = moLanguage;
        this.title = title;
        this.theme = theme;
        Navigation.current();
        $rootScope.$on('$routeChangeStart', () => this.Authentication['status']().then(() => Navigation.clear()));
        $rootScope.$on('$routeChangeSuccess', (event, target) => {
            if (!('language' in $routeParams)) {
                loc.path('/' + Language.current + '/');
            }
        });
    }

    /**
     * Expose the Authentication object.
     *
     * @return Authentication The global authentication service.
     */
    get Authentication() {
        return auth;
    }

    /**
     * Expose the Navigation object.
     *
     * @return Navigation The global navigation service.
     */
    get Navigation() {
        return nav;
    }

    /**
     * Expose the current language.
     *
     * @return string The current language identifier.
     */
    get language() {
        return Language.current;
    }

    /**
     * Expose a list of defined languages for this application.
     *
     * @return array A list of language identifiers.
     */
    get languages() {
        return Language.list;
    }

    /**
     * Logout the current user ("revoke permissions"). This is a global revoke
     * on the central Authentication service. The user is redirected to the
     * login page on success.
     *
     * @return void
     */
    logout() {
        this.Authentication.revoke().success(() => loc.path('/' + this.language + '/login/'));
    }        

    /**
     * Get the current URL.
     *
     * @return string URL The current URL ("path").
     */
    url() {
        return loc.path();
    }

    /**
     * Show Monad's license in a Bootstrap model.
     *
     * @return void
     */
    license() {
        let m = modal.open({
            template: `
<div class="modal-header">
    <h3 class="modal-title" translate>License</h3>
</div>
<div class="modal-body">
    <p><strong translate>Note: this applies to the Monad CMS framework, not (necessarily) the site it is used for :)</strong></p>
    <p ng-repeat="paragraph in paragraphs">{{paragraph}}</p>
</div>
<div class="modal-footer">
    <button class="btn btn-primary" ng-click="ok()" translate>Got it!</button>
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

RootController.$inject = ['$location', '$routeParams', '$rootScope', '$modal', 'Authentication', 'moNavigation', 'moLanguage', 'title', 'theme'];

