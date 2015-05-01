
"use strict";

import {UploadController} from './UploadController';
import {ItemController} from './List/ItemController';
import {Drag} from './Drag';
import {Item} from './List/Item';
import {Fieldset} from '../Fieldset';
import {Pk} from './Pk';
import {Text} from './Text';
import {Slug} from './Slug';
import {Textarea} from './Textarea';
import {Html} from './Html';

let ngModule = 'monad.Data';
angular.module(ngModule, ['ng'])
    .controller('monad.Data.UploadController', UploadController)
    .controller('ListItemController', ItemController)
    .directive('moItem', Item.factory)
    .directive('moFieldset', () => new Fieldset())
    .directive('moPk', () => new Pk())
    .directive('moText', () => new Text())
    .directive('moSlug', () => new Slug())
    .directive('moTextarea', () => new Textarea())
    .directive('moHtml', () => new Html())
    .directive('moDrag', Drag.factory);

export default ngModule;

