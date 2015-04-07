
"use strict";

import {Controller} from './Controller';

let ngModule = 'monad.Home';

angular.module(ngModule, [])
    .controller('Home.Controller', Controller);

export default ngModule;

