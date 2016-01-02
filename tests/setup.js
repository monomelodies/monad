
"use strict";

import monad from '../monad';
import 'angular-mocks';

angular.module('tests', ['monad.core'])
    .run(['$httpBackend', $httpBackend => {
        $httpBackend.when('GET', '../monad/i18n/en.json').respond({});
        $httpBackend.when('GET', 'i18n/en.json').respond({});
    }])
    ;

beforeEach(angular.mock.module('tests'));

