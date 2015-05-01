
"use strict";

import {default as Monad} from './../../angular';

describe("Data-list-item directive", () => {

    let scope;
    let element;

    beforeEach(angular.mock.module(Monad));
    beforeEach(angular.mock.inject(($compile, $rootScope) => {
        scope = $rootScope.$new();
        element = $compile('<monad-data-list-item item="item" meta="meta"></monad-data-list-item>')(scope);
    }));

    it("Injects item and meta", () => {
        scope.Meta = {cols: ['id']};
        scope.item = {id: 1};
        scope.$digest();
        console.log(element.html());
        expect(Monad).toBe('monad.core');
    });

});

