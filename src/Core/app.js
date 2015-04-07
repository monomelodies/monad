
import {normalizePost} from './normalizePost';
import {Controller} from './Controller';
import {default as Authentication} from '../Authentication/app';
import {default as Home} from '../Home/app';
import {default as Module} from '../Module/app';

let ngModule = 'monad.Core';
angular.module(ngModule, ['pascalprecht.translate', 'ngRoute', Authentication, Home, Module])
    .run(['$http', normalizePost])
    .controller('Core.Controller', Controller);

export default ngModule;

