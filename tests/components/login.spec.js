
"use strict";

describe('Login component', () => {
    let element = undefined;
    let $rootScope = undefined;
    let $compile = undefined;

    let mod = angular.module('tests.login', []).service('Authentication', function () {
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

    describe('Not logged in', () => {
        it('should show the login form prior to authentication', () => {
            let tpl = angular.element(`
            <monad-login>
                <h1>logged in</h1>
            </monad-login>
            `);
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            expect(element.find('form').length).toBe(1);
        });
    });

    describe('Logged in', () => {
        it('should display a h1', () => {
            let tpl = angular.element(`
            <monad-login>
                <h1>logged in</h1>
            </monad-login>
            `);
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            element.find('input').eq(0).val('test').triggerHandler('input');
            element.find('input').eq(1).val('test').triggerHandler('input');
            element.find('form').triggerHandler('submit');
            expect(element.find('h1').length).toBe(1);
        });
    });

    describe('Wrong credentials', () => {
        it('should display the login form', () => {
            let tpl = angular.element(`
            <monad-login>
                <h1>logged in</h1>
            </monad-login>
            `);
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            element.find('input').eq(0).val('bla').triggerHandler('input');
            element.find('input').eq(1).val('bla').triggerHandler('input')
            element.find('form').triggerHandler('submit');
            expect(element.find('form').length).toBe(1);
        });
    });
});

