
import {HomeController} from './home/Controller';

export function routing($stateProvider, $translateProvider)
{
    $translateProvider.preferredLanguage('nl');
    $stateProvider.
        state('404', {
            controller: '404Controller',
            templateUrl: '/assets/html/page/404.html'
        }).
        state('home', {
            url: '/',
            controller: ['$rootScope', '$http', HomeController],
            controllerAs: 'home',
            templateUrl: '/assets/html/page/home.html'
        });
}

