
"use strict";

describe('Try component', () => {
    let element = undefined;
    let $rootScope = undefined;
    let $compile = undefined;
    let Authentication = undefined;

    let mod = angular.module('tests.try', []).service('Authentication', function () {
        this.check = false;
        this.attempt = credentials => {
            if (credentials.username == 'test' && credentials.password == 'test') {
                this.check = true;
            }
        };
        this.status = () => this.check;
    });
    beforeEach(angular.mock.module(mod.name));

    beforeEach(inject((_$rootScope_, _$compile_, _Authentication_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        Authentication = _Authentication_;
    }));

    describe('Tray component', () => {
        it('should return an <ul>', () => {
            let tpl = angular.element('<monad-tray></monad-tray>');
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            expect(element.find('ul').length).toBe(1);
        });
    });
});

