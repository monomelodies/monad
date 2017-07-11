
"use strict";

describe('Footer component', () => {
    let element = undefined;
    let $rootScope = undefined;
    let $compile = undefined;
    let Authentication = undefined;

    let mod = angular.module('tests.footer', []).service('Authentication', ['$q', function ($q) {
        this.check = false;
        this.attempt = credentials => {
            if (credentials.username == 'test' && credentials.password == 'test') {
                this.check = true;
            }
        };
        this.status = () => {
            let deferred = $q.defer();
            deferred.resolve(this.check);
            return deferred.promise;
        };
    }]);
    beforeEach(angular.mock.module(mod.name));

    beforeEach(inject((_$rootScope_, _$compile_, _Authentication_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Authentication = _Authentication_;
    }));

    describe('Footer while not logged in', () => {
        it('should only display one li', () => {
            let tpl = angular.element('<monad-footer></monad-footer>');
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            expect(element.find('li').length).toBe(1);
        });
    });

    describe('Footer while logged in', () => {
        it('should display two lis', () => {
            Authentication.check = true;
            let tpl = angular.element('<monad-footer></monad-footer>');
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            expect(element.find('li').length).toBe(2);
            Authentication.check = false;
        });
    });
});

