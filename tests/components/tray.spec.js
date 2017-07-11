
"use strict";

describe('Try component', () => {
    let element = undefined;
    let $rootScope = undefined;
    let $compile = undefined;

    beforeEach(inject((_$rootScope_, _$compile_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
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

