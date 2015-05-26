
"use strict";

import {Component} from '../src/classes/Component';

describe("Monad global application and component handler", () => {

    describe("Monad global object", () => {

        monad.component('testComponent');
        let app = monad.application('test');

        it("Registers the application", () => {
            expect(app.name).toBe('monad');
        });
        it("Can only load once", () => {
            expect(() => monad.application('test')).toThrow();
        });
        it("automatically receive component dependencies", () => {
//            console.log(Component.get('monad'));
        });

    });

});

