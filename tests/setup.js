
"use strict";

import monad from '../src';
import 'angular-mocks';

let test = angular.module('tests', [monad.name])
    .service('Authentication', function () {
        this['status'] = () => {};
        this.check = () => true;
    });

beforeEach(angular.mock.module(test.name));

