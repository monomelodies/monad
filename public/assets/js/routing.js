
import {HomeController} from './home/Controller';

export function routing($routeProvider, $translateProvider)
{
    $translateProvider.preferredLanguage('nl');
    $routeProvider.when('/', {
        controller: HomeController,
        controllerAs: 'home',
        templateUrl: '/assets/html/home/view.html'
    }).
        otherwise({
            controller: '404Controller',
            templateUrl: '/assets/html/404/view.html'
        });
}

