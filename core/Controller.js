
class Controller
{
    constructor($rootScope)
    {
        this.title = 'Default generic administrator';
        this.paths = {
            root: '/monad/',
            bootstrap: '/vendor/github/twbs/bootstrap@3.3.4',
            monad: '/vendor/github/monomelodies/monad@nextgen/build',
            theme: undefined
        };
    }
}

Controller.$inject = ['$rootScope'];

export {Controller};

