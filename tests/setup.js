
"use strict";

angular.module('tests', ['monad.core'])
    .run(['$httpBackend', $httpBackend => {
        $httpBackend.when('GET', '../monad/i18n/en.json').respond({});
        $httpBackend.when('GET', '../js/i18n/en.json').respond({});
    }])
    ;

beforeEach(angular.mock.module('TEMPLATES'));
beforeEach(angular.mock.module('tests'));
beforeEach(angular.mock.module('ngCookies'));

