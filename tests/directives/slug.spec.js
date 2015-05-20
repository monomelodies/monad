
"use strict";

describe('directive: mo-slug', () => {
    let element;
    let scope;
    let compile;
    let item = {foo: 'Lorem', bar: 'lorem'};
    let tpl = angular.element(`<input ng-model="item.foo"><input ng-model="item.bar" mo-slug="item.foo">`);

    beforeEach(inject(($rootScope, $compile, $routeParams) => {
        $routeParams.language = 'en';
        scope = $rootScope;
        scope.item = item;
        compile = $compile;
    }));

    it('should update bar with a slugified version of foo', () => {
        scope.$apply(() => {
            scope.item.foo = 'Lorem ipsum Dolor SIT amet!!!!';
        });
        element = compile(tpl)(scope);
        scope.$digest();
        expect(scope.item.bar).toBe('lorem-ipsum-dolor-sit-amet');
    });
});

