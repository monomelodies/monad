
"use strict";

import monad from '../src';
import 'angular-mocks';

let test = angular.module('tests', [monad.name])
    .service('Authentication', ['$q', function ($q) {
        this.check = false;
        this['status'] = () => {
            let deferred = $q.defer();
            deferred.resolve(this.check);
            return deferred.promise;
        };
        this.attempt = credentials => {
            if (credentials.username == 'test' && credentials.password == 'test') {
                this.check = true;
            }
        };
    }]);

beforeEach(angular.mock.module(test.name));

