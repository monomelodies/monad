
"use strict";

describe('Login component', () => {
    let element = undefined;
    let $rootScope = undefined;
    let $compile = undefined;

    let mod = angular.module('tests.login', ['tests']);
    beforeEach(angular.mock.module(mod.name));
    let html = `<monad-login>
        <h1>logged in</h1>
    </monad-login>
    `;

    beforeEach(inject((_$rootScope_, _$compile_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
    }));

    describe('Not logged in', () => {
        it('should show the login form prior to authentication', () => {
            let tpl = angular.element(html);
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            expect(element.find('form').length).toBe(1);
        });
    });

    describe('Logged in', () => {
        it('should display a h1', () => {
            let tpl = angular.element(html);
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            element.find('input').eq(0).val('test').triggerHandler('input');
            element.find('input').eq(1).val('test').triggerHandler('input');
            element.find('form').triggerHandler('submit');
            expect(element.find('h1').length).toBe(1);
        });
    });

    describe('Wrong credentials', () => {
        it('should keep displaying the login form when authentication fails', () => {
            let tpl = angular.element(html);
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            element.find('input').eq(0).val('bla').triggerHandler('input');
            element.find('input').eq(1).val('bla').triggerHandler('input')
            element.find('form').triggerHandler('submit');
            expect(element.find('form').length).toBe(1);
        });
    });
});

