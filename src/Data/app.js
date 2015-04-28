
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
    .directive('mdItem', Item.factory)
    .directive('mdFieldset', () => new Fieldset())
    .directive('mdPk', () => new Pk())
    .directive('mdText', () => new Text())
    .directive('mdSlug', () => new Slug())
    .directive('mdTextarea', () => new Textarea())
    .directive('mdHtml', () => new Html())
    .directive('mdDrag', Drag.factory);

export default ngModule;

