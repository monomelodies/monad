
"use strict";

import {default as normalizePost} from './normalizePost';
import {Controller} from './Controller';
//import {default as Authentication} from '../Authentication/app';
//import {default as Home} from '../Home/app';
import {default as Data} from '../Data/app';
import {Module} from '../Module';
import {Path} from './Path';

let ngModule = 'monad.core';
//angular.module(ngModule, ['ng', 'pascalprecht.translate', 'ngRoute', Authentication, Home, Data, 'ngCkeditor', 'ngSanitize', 'angularFileUpload'])
angular.module(ngModule, ['ng', 'pascalprecht.translate', 'ngRoute', Data, 'ngCkeditor', 'ngSanitize', 'angularFileUpload'])
    .run(['$http', normalizePost])
    .service('moModule', Module)
    .directive('moPath', Path.factory)
    .controller('moController', Controller);

export default ngModule;

