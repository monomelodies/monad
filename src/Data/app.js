
"use strict";

import {ListController} from './ListController';
import {ItemController} from './ItemController';

let ngModule = 'monad.Data';
angular.module(ngModule, [])
    .controller('Data.ListController', ListController)
    .controller('Data.ItemController', ItemController);

export default ngModule;

