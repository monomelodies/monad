
"use strict";

import {ListController} from './ListController';
import {ItemController} from './ItemController';
import {Service} from './Service';

let ngModule = 'monad.Module';
angular.module(ngModule, [])
    .controller('Module.ListController', ListController)
    .controller('Module.ItemController', ItemController)
    .service('Module.Service', Service);

export default ngModule;

