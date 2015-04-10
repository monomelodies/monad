
"use strict";

import {ListController} from './ListController';
import {ItemController} from './ItemController';
import {Drag} from './Drag';

let ngModule = 'monad.Data';
angular.module(ngModule, [])
    .controller('Data.ListController', ListController)
    .controller('Data.ItemController', ItemController)
    .directive('monadDrag', Drag.factory);

export default ngModule;

