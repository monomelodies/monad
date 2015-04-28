
import {default as Core} from './core/app';
import {default as Home} from './home/app';
import {Controller as HomeController} from './home/Controller';
import {LoginController} from './authentication/LoginController';
import {default as Authentication} from './authentication/app';

let ngModule = 'monad.bootstrap';

angular.module(ngModule, [Core])
    .config(['$translateProvider', '$routeProvider', '$locationProvider', function($translateProvider, $routeProvider, $locationProvider) {
        $translateProvider.preferredLanguage('en');
        $translateProvider.translations('en', {
            monad: {
                data: {
                    data: 'Data',
                    submit: 'Save changes',
                    'delete': 'Delete',
                    create: 'Create'
                },
                id: 'ID',
                title: 'Title',
                slug: 'Slug',
                keywords: 'Keywords',
                description: 'Description',
                login: {
                    login: 'Please login',
                    username: 'Username',
                    password: 'Password',
                    go: 'Login'
                },
                logout: 'Logout'
            }
        });
        $translateProvider.translations('nl', {
            monad: {
                data: {
                    data: 'Gegevens',
                    submit: 'Wijzigingen opslaan',
                    'delete': 'Verwijderen',
                    create: 'Toevoegen'
                },
                id: 'ID',
                title: 'Titel',
                slug: 'Slug',
                keywords: 'Steekwoorden',
                description: 'Omschrijving',
                login: {
                    login: 'Log in a.u.b.',
                    username: 'Gebruikersnaam',
                    password: 'Wachtwoord',
                    go: 'Inloggen'
                },
                logout: 'Uitloggen'
            }
        });
        $locationProvider.html5Mode(false);
        $routeProvider.
            when('/', {
                controller: 'RootController'
            }).
            when('/:language/', {
                controller: HomeController,
                controllerAs: 'home',
                templateUrl: 'monad/template/home.html'
            }).
            when('/:language/login/', {
                controller: LoginController,
                controllerAs: 'login',
                templateUrl: 'monad/template/login.html'
            });
    }]);

export default ngModule;

