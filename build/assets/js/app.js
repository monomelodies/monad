
import {runner} from "./run";
//import {routing} from "./routing";

angular.module('monad', [
    'ngRoute',
    'ngAnimate',
    'ngSanitize',
    'pascalprecht.translate'
]);

/*
angular.module('monad').config(['$stateProvider', '$translateProvider', routing]);
*/
angular.module('monad').config(['$routeProvider', function($routeProvider) {

$routeProvider.route('home', {
    'url': '/',
    'controller': function() {
        alert('yay');
    },
    'templateUrl': '/assets/html/page/home.html'
});

}]);
angular.module('monad').run(['$http', '$rootScope', runner]);

export angular.module('monad');

