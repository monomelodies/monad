
import {Service} from './Service';
import {LoginController} from './LoginController';

let ngModule = 'monad.Authentication';
angular.module(ngModule, [])
    .service('monad.Authentication.Service', Service)
    .controller('monad.Authentication.LoginController', LoginController);

export default ngModule;

