
"use strict";

import login from './Login/component';
import list from './List/component';
import update from './Update/component';

export default angular.module('monad.components', [login, list, update]).name;

