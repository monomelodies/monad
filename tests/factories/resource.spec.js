
describe("class: Model", () => {

    let moResource = undefined;

    beforeEach(inject(function (_moResource_, $httpBackend) {
        moResource = _moResource_;
        $httpBackend.when('GET', '/test/1').respond({
            id: 1,
            foo: 'bar'
        });
    }));

    it("does proper $dirty checking", () => {
        let res = moResource('/test/:id', {id: '@id'});
        let model = res.get({id: 1});
        model.$promise.then(() => {
            expect(model.foo).toEqual('bar');
            expect(model.$dirty).toEqual(false);
            model.foo = 'foo';
            expect(model.$dirty).toEqual(true);
            model.foo = 'bar';
            expect(model.$dirty).toEqual(false);
        });
    });

});

