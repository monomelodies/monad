
"use strict";

import monad from '../src/angular';
import '../node_modules/angular-mocks/angular-mocks.js';

angular.module('tests', ['monad.core'])
    .run(['$httpBackend', $httpBackend => {
        $httpBackend.when('GET', '../monad/i18n/en.json').respond({});
        $httpBackend.when('GET', 'i18n/en.json').respond({});
    }])
    ;

beforeEach(angular.mock.module('TEMPLATES'));
beforeEach(angular.mock.module('tests'));

