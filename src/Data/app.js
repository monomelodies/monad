
"use strict";

import {ListController} from './ListController';
import {ItemController} from './ItemController';
import {UploadController} from './UploadController';
import {Drag} from './Drag';

let ngModule = 'monad.Data';
angular.module(ngModule, [])
    .controller('monad.Data.ListController', ListController)
    .controller('monad.Data.ItemController', ItemController)
    .controller('monad.Data.UploadController', UploadController)
    .directive('monadDrag', Drag.factory);

export default ngModule;

