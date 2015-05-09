
"use strict";

import {default as setup} from './setup';

describe("Main entry point for Monad", () => {

    it("Loads", () => {
        expect(setup.Monad).toBe('monad.core');
    });

    /*
    describe("Monad module handling", () => {
        it("Registers", () => {
            expect(Module.register('Test', {})).toBe('Test');
        });
        it("Can be retrieved", () => {
            expect(Module.retrieve('Test').app).toBe('Test');
        });
    });
    */

});

