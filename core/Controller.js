
class Controller
{
    constructor(Authentication, $state)
    {
        this.Authentication = Authentication;
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
        if (this.loginRequired) {
            $state.go('login');
        }
    }
    addToNavigation(module, menu = 'main')
    {
        this.navigation[menu] = this.navigation[menu] || [];
        module.exposes.map(function(option) {
            this.navigation[menu].push(option);
        });
    }
}

Controller.$inject = ['Authentication', '$state'];

export {Controller};

