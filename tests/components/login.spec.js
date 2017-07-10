
"use strict";

describe('Login component', () => {
    let element = undefined;
    let $rootScope = undefined;
    let $compile = undefined;
    let tpl = angular.element(`
<monad-login>
    <h1>logged in</h1>
</monad-login>
    `);

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
            $rootScope.$apply(() => {
                $rootScope.credentials = {};
            });
            element = $compile(tpl)($rootScope);
            $rootScope.$digest();
            expect(element.find('form').length).toBe(1);
        });
    });
});

