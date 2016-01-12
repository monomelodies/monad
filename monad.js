
"use strict";

import 'babel-polyfill';
import 'angular';
import 'angular-ui-bootstrap';
import 'angular-ui-bootstrap/ui-bootstrap-tpls.js';
import 'angular-route';
import 'angular-sanitize';
import 'angular-animate';
import 'autofill-event';
import 'angular-gettext';
import './i18n';
import './templates';
import monad from './src/angular';

angular.element(document).ready(() => window.monad.bootstrap());

export default monad;

