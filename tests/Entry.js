
"use strict";

import {default as Monad} from './../angular';

describe("Main entry point for Monad", () => {

    beforeEach(angular.mock.module(Monad));

    it("Loads", () => {
        expect(Monad).toBe('monad.core');
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

