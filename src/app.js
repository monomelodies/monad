
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
                }
            }
        });
        $locationProvider.html5Mode(false);
        $routeProvider.
            when('/', {
                controller: 'Home.Controller',
                controllerAs: 'home',
                templateUrl: 'monad/src/Home/view.html'
            }).
            when('/login/', {
                controller: 'Authentication.LoginController',
                controllerAs: 'login',
                templateUrl: 'monad/src/Authentication/login.html'
            });
    }]);

export default Core;

