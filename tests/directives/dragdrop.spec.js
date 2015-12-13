
"use strict";

describe('directive: mo-drag-drop', () => {
    let element;
    let scope;
    let compile;
    let tpl = angular.element(`<div>
        <div ng-repeat="item in items" mo-drag-drop="item" list="items" position="position" track="foo">{{item.foo}} {{item.id}} {{item.position}}</div>
    </div>`);
    let items = [{id: 1, position: 0, foo: 'bar'}, {id: 2, position: 1, foo: 'baz'}, {id: 3, position: 2, foo: 'buzz'}];

    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope;
        compile = $compile;
    }));

    it('should track the correct properties', () => {
        scope.$apply(() => {
            scope.items = items;
        });
        element = compile(tpl)(scope);
        scope.$digest();
        let divs = element.find('div');
        expect(divs.eq(2).text()).toBe('buzz 3 2');

        divs.eq(0).triggerHandler('dragstart');
        divs.eq(1).triggerHandler('dragenter');
        divs.eq(1).triggerHandler('drop');

        expect(scope.items[0].id).toBe(2);
        expect(element.find('div').eq(1).text()).toBe('baz 1 1');
    });
});

