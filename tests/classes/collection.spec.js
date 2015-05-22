
import {Collection} from '../../src/classes/Collection';
import {Model} from '../../src/classes/Model';

// Test class
class Test extends Collection {

    constructor() {
        super();
    }

};

let t = new Test();
t.push({foo: 'bar'}, (new Model()).$load({foo: 'baz'}));

describe("class: Collection", () => {

    let element;
    let scope;
    let compile;
    let tpl = angular.element('<div><span ng-repeat="(idx, el) in test">{{idx}}: {{el.foo}}</span></div>');
    
    beforeEach(inject(($rootScope, $compile) => {
        scope = $rootScope;
        compile = $compile;
    }));

    it("has a length of two", () => {
        expect(t.length).toBe(2);
    });

    it("should become dirty", () => {
        expect(t.$dirty).toEqual(true);
        expect(t[0].$new).toEqual(true);
        expect(t[1].$dirty).toEqual(false);
        t[1].foo = 'buzz';
        expect(t[1].$dirty).toEqual(true);
    });

    it("should be considered arrayLike by angular", () => {
        // More or less from angular source:
        function isArrayLike(obj) {
            if (obj == null) {
                return false;
            }
            var length = obj.length;
            return Array.isArray(obj) || length === 0 ||
                typeof length === 'number' && length > 0 && (length - 1) in obj;
        }

        expect(isArrayLike(t)).toEqual(true);
    });

    it("should be enumerable in angular", () => {
        scope.$apply(() => {
            scope.test = t;
        });
        element = compile(tpl)(scope);
        scope.$digest();
        expect(element.find('span').length).toBe(2);
        expect(element.find('span').eq(0).text()).toBe('0: bar');
        expect(element.find('span').eq(1).text()).toBe('1: buzz');

        t.push({foo: 'fizz'});
        scope.$digest();
        expect(element.find('span').eq(2).text()).toBe('2: fizz');

        t.pop();
        scope.$digest();
        expect(element.find('span').eq(2).length).toBe(0);
    });

});

