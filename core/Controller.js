
class Controller
{
    constructor()
    {
        this.title = 'Default generic administrator';
        this.paths = {
            root: '/monad/',
            bootstrap: '/vendor/github/twbs/bootstrap@3.3.4',
            monad: '/vendor/github/monomelodies/monad@nextgen',
            theme: undefined
        };
        this.navigation = {
            main: [
                {url: '/', title: 'Site'}
            ]
        };
    }
    addToNavigation(module, menu = 'main')
    {
        this.navigation[menu] = this.navigation[menu] || [];
        module.exposes.map(function(option) {
            this.navigation[menu].push(option);
        });
    }
}

export {Controller};

