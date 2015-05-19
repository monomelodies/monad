
"use strict";

describe('directive: mo-path', () => {
    let element;
    let scope;
    let compile;
    let items = [{id: 1, txt: 'foo'}, {id: 2, txt: 'bar'}];
    let tpl = angular.element(`<a mo-path="{{path}}" arguments="{foo: 'bar'}">{{txt}}</a>`);

    beforeEach(inject(($rootScope, $compile, $routeParams) => {
        $routeParams.language = 'en';
        scope = $rootScope;
        compile = $compile;
    }));

    it('should add an href to the element and interpolate contents', () => {
        scope.$apply(() => {
            scope.path = '/:language/something/:foo/';
            scope.txt = 'link';
        });
        element = compile(tpl)(scope);
        scope.$digest();
        expect(element.attr('href')).toBe('#/en/something/bar/');
        expect(element.text()).toBe('link');
    });
});

