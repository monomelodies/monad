
import {Service} from './Service';
import {LoginController} from './LoginController';

let ngModule = 'monad.Authentication';
angular.module(ngModule, ['ng'])
    .service('Service', Service)
    .controller('LoginController', LoginController);

export default ngModule;

