
import {default as Core} from './core/app';
import {default as Home} from './home/angular';
import {LoginController} from './authentication/LoginController';
import {default as Authentication} from './authentication/app';

let ngModule = 'monad.bootstrap';

angular.module(ngModule, [Core, Home])
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
                controller: 'moController'
            }).
            when('/:language/', {
                controller: 'moHomeController',
                controllerAs: 'home',
                templateUrl: 'monad/template/home.html'
            }).
            when('/:language/login/', {
                controller: 'moLoginController',
                controllerAs: 'login',
                templateUrl: 'monad/template/login.html'
            });
    }]);

export default ngModule;

