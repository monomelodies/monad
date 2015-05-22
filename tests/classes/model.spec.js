
import {Model} from '../../src/classes/Model';

// Test class
class Test extends Model {

    constructor() {
        super();
    }

};

let test1 = (new Test()).$create({foo: 'bar'});
let test2 = (new Test()).$load({foo: 'baz'});

describe("class: Model", () => {

    it("does proper $new and $dirty checking", () => {
        expect(test1.$new).toEqual(true);
        expect(test1.$dirty).toEqual(false);
        expect(test2.$new).toEqual(false);
        expect(test2.$dirty).toEqual(false);
        test1.foo = 'fizz';
        test2.foo = 'buzz';
        expect(test1.$dirty).toEqual(false);
        expect(test2.$dirty).toEqual(true);
    });

});

