
"use strict";

import Manager from '../../src/services/Manager';
import Collection from '../../src/classes/Collection';
import Model from '../../src/classes/Model';

describe('service: Manager', () => {

    let mngr;
    let http;

    angular.module('tests').service('testsServiceManager', Manager);

    beforeEach(inject((testsServiceManager, $httpBackend) => {
        mngr = testsServiceManager;
        http = $httpBackend;
        http.when('GET', '/tests/service/').respond([
            {id: 1, foo: 'bar'},
            {id: 2, foo: 'baz'},
            {id: 3, foo: 'buz'}
        ]);
        http.when('GET', '/tests/service/1/').respond({id: 1, foo: 'bar'});
    }));

    it("should list a Collection", () => {
        http.expectGET('/tests/service/');
        let coll;
        mngr.list('/tests/service/').success(c => coll = c);
        http.flush();
        expect(coll instanceof Collection).toEqual(true);
        expect(coll.length).toBe(3);
        expect(coll.$dirty).toBe(false);
    });

    it("should find a Model", () => {
        http.expectGET('/tests/service/1/');
        let model;
        mngr.find('/tests/service/1/').success(m => model = m);
        http.flush();
        expect(model instanceof Model).toEqual(true);
        expect(model.$dirty).toBe(false);
        model.foo = 'buz';
        expect(model.$dirty).toBe(true);
    });

    it('should not attempt to save pristine models', () => {
        let m = new Model();
        m.$load({foo: 'bar'});
        mngr.save(m);
    });

    it('should throw an exception when saving', () => {
        let m = new Model();
        m.$load({foo: 'bar'});
        m.foo = 'baz';
        expect(() => mngr.save(m)).toThrow();
    });

});

