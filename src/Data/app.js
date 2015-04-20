
"use strict";

import {UploadController} from './UploadController';
import {ItemController} from './List/ItemController';
import {Drag} from './Drag';
import {Item} from './Item/directive';

let ngModule = 'monad.Data';
angular.module(ngModule, ['ng'])
    .controller('monad.Data.UploadController', UploadController)
    .controller('ListItemController', ItemController)
    .directive('monadDataItem', Item.factory)
    .directive('monadDrag', Drag.factory);

export default ngModule;

