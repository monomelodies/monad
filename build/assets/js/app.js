
import {runner} from "./run";
import {routing} from "./routing";

angular.module('monad', [
    'ui.router',
    'ngAnimate',
    'ngSanitize',
    'pascalprecht.translate'
]);

/*
angular.module('monad').config(['$stateProvider', '$translateProvider', routing]);
*/
angular.module('monad').config(['$stateProvider', function($stateProvider) {

$stateProvider.state('home', {
    'url': '/',
    'controller': function() {
        alert('yay');
    },
    'templateUrl': '/assets/html/page/home.html'
});

}]);
angular.module('monad').run(['$http', '$rootScope', runner]);

