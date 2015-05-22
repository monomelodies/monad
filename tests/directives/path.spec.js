
"use strict";

describe('directive: mo-path', () => {
    let element;
    let scope;
    let compile;
    let tpl = angular.element(`<a mo-path="{{path}}" arguments="{language: 'en', foo: 'bar'}">{{txt}}</a>`);

    beforeEach(inject(($rootScope, $compile) => {
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

