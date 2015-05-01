
import {Service} from './Service';
import {LoginController} from './LoginController';

let ngModule = 'monad.Authentication';
angular.module(ngModule, ['ng'])
    .service('moAuthentication', Service)
    .controller('moLoginController', LoginController);

export default ngModule;

