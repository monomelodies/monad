
import {Service} from './Service';
import {LoginController} from './LoginController';

let ngModule = 'monad.Authentication';
angular.module(ngModule, [])
    .service('Authentication.Service', Service)
    .controller('Authentication.LoginController', LoginController);

export default ngModule;

