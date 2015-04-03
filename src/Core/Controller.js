
class Controller {

    constructor(AuthenticationService, $location, ModuleService) {
        this.Authentication = AuthenticationService;
        this.modules = ModuleService;
        this.title = 'Default generic administrator';
        this.loginRequired = this.loginRequired || true;
        this.paths = {
            root: '/monad/',
            bootstrap: '/vendor/github/twbs/bootstrap@3.3.4',
            monad: '/vendor/github/monomelodies/monad@nextgen'
        };
        this.paths.theme = this.paths.monad + '/css/default.css';
        this.navigation = {
            main: [
                {url: '/', title: 'Site'}
            ]
        };
        this.Authentication.read().success(result => {
            if (!this.Authentication.isAuthenticated() && this.loginRequired) {
                $location.path('/login/');
            }
        });
        this.config();
    }

    /**
     * This is for overriding in an extending root controller, so we don't
     * have to remember to re-inject all dependencies which would suck
     * pretty badly.
     */
    config() {
    }
};

Controller.$inject = ['AuthenticationService', '$location', 'ModuleService'];

export {Controller};

