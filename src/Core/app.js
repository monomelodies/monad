
"use strict";

import {normalizePost} from './normalizePost';
import {Controller} from './Controller';
import {default as Authentication} from '../Authentication/app';
import {default as Home} from '../Home/app';
import {default as Data} from '../Data/app';

let ngModule = 'monad.Core';
angular.module(ngModule, ['pascalprecht.translate', 'ngRoute', Authentication, Home, Data, 'ngCkeditor', 'ngSanitize', 'angularFileUpload'])
    .run(['$http', normalizePost])
    .controller('monad.Core.Controller', Controller);

export default ngModule;

