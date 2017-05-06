
"use strict";

import login from './Login/component';
import list from './List/component';
import update from './Update/component';
import footer from './Footer';
import tray from './Tray';

export default angular.module('monad.components', ['monad.cms', login, list, update, footer, tray]).name;

