
"use strict";

angular.module('tests', ['monad.core'])
    .config(['$translateProvider', $translateProvider => $translateProvider.useLoader('$translatePartialLoader', {urlTemplate: 'foo.json'})])
    .run(['$httpBackend', $httpBackend => $httpBackend.when('GET', 'foo.json').respond({})])
    ;

beforeEach(angular.mock.module('TEMPLATES'));
beforeEach(angular.mock.module('tests'));

