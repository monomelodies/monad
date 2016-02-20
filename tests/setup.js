
"use strict";

import monad from '../src/angular';
import 'angular-mocks';

angular.module('tests', ['monad'])
    .service('Authentication', function () {
        this['status'] = () => {};
        this.check = () => true;
    });

beforeEach(angular.mock.module('tests'));

