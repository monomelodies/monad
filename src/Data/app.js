
"use strict";

import {UploadController} from './UploadController';
import {ItemController} from './List/ItemController';
import {Drag} from './Drag';
import {Item} from './List/Item';
import {Fieldset} from './Fieldset';
import {Pk} from './Pk';
import {Text} from './Text';
import {Slug} from './Slug';
import {Textarea} from './Textarea';
import {Html} from './Html';

let ngModule = 'monad.Data';
angular.module(ngModule, ['ng'])
    .controller('monad.Data.UploadController', UploadController)
    .controller('ListItemController', ItemController)
    .directive('monadDataItem', Item.factory)
    .directive('monadDataFieldset', Fieldset.factory)
    .directive('monadDataPk', () => new Pk())
    .directive('monadDataText', () => new Text())
    .directive('monadDataSlug', () => new Slug())
    .directive('monadDataTextarea', () => new Textarea())
    .directive('monadDataHtml', () => new Html())
    .directive('monadDrag', Drag.factory);

export default ngModule;

