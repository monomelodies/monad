
/**
 * TODO: think of a sane test implementation for this...
 */
describe("class: Component", () => {

    let test = monad.component('foo/bar/baz/buz').manager(() => {});

    it("normalizes names correctly", () => {
        expect(test.$manager.name).toEqual('fooBarBazBuzManager');
    });

});

