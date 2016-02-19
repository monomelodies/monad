
import Model from '../src/Model';

// Test class
class Test extends Model {

    constructor() {
        super();
    }

};

let test1 = new Model({foo: 'bar'});
let test2 = new Model({foo: 'baz'});

describe("class: Model", () => {

    it("does proper $dirty checking", () => {
        expect(test1.$dirty).toEqual(false);
        expect(test2.$dirty).toEqual(false);
        test1.foo = undefined;
        test2.foo = 'buzz';
        expect(test1.$dirty).toEqual(true);
        expect(test2.$dirty).toEqual(true);
    });

});

