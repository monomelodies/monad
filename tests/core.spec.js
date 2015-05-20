
"use strict";

describe("Main entry point for Monad", () => {

    describe("Monad global object", () => {
        it("Registers the application", () => {
            expect(monad.application('test').name).toBe('monad');
        });
        it("Can only load once", () => {
            expect(() => monad.application('test')).toThrow();
        });
    });

});

