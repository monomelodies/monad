
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
     * @param object $uibModal Injected Bootstrap $uibModal service.
     * @param object Authentication Injected global Authentication service.
     * @param object Navigation Injected Monad Navigation service.
     * @param object moLanguage Injected Monad Language service.
     * @param object title Injected Monad `title` value.
     * @param object theme Injected Monad `theme` value.
     * @return void
     */
    constructor($location, $routeParams, $rootScope, $uibModal, Authentication, Navigation, moLanguage, title, theme, Report, liveReload) {
        loc = $location;
        auth = Authentication;
        nav = Navigation;
        modal = $uibModal;
        Language = moLanguage;
        this.title = title;
        this.theme = theme;
        this.messages = Report.messages;
        this.liveReload = liveReload;
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
            templateUrl: '/monad/templates/license.html',
            controller: ['$scope', '$uibModalInstance', ($scope, $uibModalInstance) => {
                $scope.ok = $uibModalInstance.close;
            }]
        });
    }

};

RootController.$inject = [
    '$location', '$routeParams', '$rootScope', '$uibModal', 'Authentication', 'moNavigation', 'moLanguage', 'title', 'theme', 'moReport', 'liveReload'
];

