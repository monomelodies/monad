
"use strict";

describe('Footer component', () => {
    let element = undefined;
    let $rootScope = undefined;
    let $compile = undefined;

    let mod = angular.module('tests.footer', []).service('Authentication', function () {
        this.check = false;
        this.attempt = credentials => {
            if (credentials.username == 'test' && credentials.password == 'test') {
                this.check = true;
            }
        };
        this.status = () => this.check;
    });
    beforeEach(angular.mock.module(mod.name));

    beforeEach(inject((_$rootScope_, _$compile_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    describe('Footer while not logged in', () => {
        it('should not display a logout button', () => {
            let tpl = angular.element('<monad-footer></monad-footer>');
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            expect(element.find('#logout').length).toBe(0);
        });
    });
});

