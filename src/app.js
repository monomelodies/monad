
import {default as Core} from './Core/app';

angular.module(Core)
    .config(['$translateProvider', '$routeProvider', '$locationProvider', function($translateProvider, $routeProvider, $locationProvider) {
        $translateProvider.preferredLanguage('en');
        $translateProvider.translations('en', {
            monad: {
                data: 'Data',
                id: 'ID',
                title: 'Title',
                slug: 'Slug',
                keywords: 'Keywords',
                description: 'Description',
                login: {
                    username: 'Username',
                    password: 'Password'
                },
                logout: 'Logout'
            }
        });
        $translateProvider.translations('nl', {
            monad: {
                data: 'Data',
                id: 'ID',
                title: 'Titel',
                slug: 'Slug',
                keywords: 'Steekwoorden',
                description: 'Omschrijving',
                login: {
                    username: 'Gebruikersnaam',
                    password: 'Wachtwoord'
                },
                logout: 'Uitloggen'
            }
        });
        $locationProvider.html5Mode(false);
        $routeProvider.
            when('/:language/', {
                controller: 'Home.Controller',
                controllerAs: 'home',
                templateUrl: 'monad/src/Home/view.html'
            }).
            when('/:language/login/', {
                controller: 'Authentication.LoginController',
                controllerAs: 'login',
                templateUrl: 'monad/src/Authentication/login.html'
            });
    }]);

export default Core;

