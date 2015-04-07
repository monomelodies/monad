
class Controller {

    constructor(Authentication, $location, Module) {
        this.Authentication = Authentication;
        this.modules = Module;
        this.title = 'Default generic administrator';
        this.loginRequired = this.loginRequired || true;
        this.paths = {
            root: '/monad/',
            theme: 'monad/css/default.css'
        };
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

    select(menu, item = {}) {
        this.navigation[menu].map(item => item.selected = false);
        item.selected = true;
    }

};

Controller.$inject = ['Authentication.Service', '$location', 'Module.Service'];

export {Controller};

