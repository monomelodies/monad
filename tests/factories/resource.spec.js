
describe("class: Model", () => {

    let moResource = undefined;

    beforeEach(inject(function (_moResource_, $httpBackend) {
        moResource = _moResource_;
        $httpBackend.when('GET', '/test/1').respond({
            id: 1,
            foo: 'bar',
            title: 'I have a name',
            'status': 1
        });
        $httpBackend.when('GET', '/test/2').respond({
            id: 2,
            foo: 'foo',
            title: 'I have a different name',
            'status': 2
        });
        $httpBackend.when('GET', '/test/3').respond({
            id: 3,
            foo: 'foobar',
            title: 'I have both bits set',
            'status': 3
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

    it("guesstimates the title", () => {
        let res = moResource('/test/:id', {id: '@id'});
        let model = res.get({id: 1});
        model.$promise.then(() => {
            expect(model.$title()).toEqual('I have a name');
        });
    });

    it("can be marked as deleted", () => {
        let res = moResource('/test/:id', {id: '@id'});
        let model = res.get({id: 1});
        model.$promise.then(() => {
            model.$deleted(true);
            expect(model.$deleted()).toBe(true);
            model.$deleted(false);
            expect(model.$deleted()).toBe(false);
        });
    });

    it("correctly defines bitflags", () => {
        let res = moResource('/test/:id', {id: '@id'});
        res.setBitflags('status', {'$foo': 1, '$bar': 2});
        let model = res.get({id: 1});
        model.$promise.then(() => {
            expect(model.$foo).toBe(true);
            expect(model.$bar).toBe(false);
        });
        model = res.get({id: 2});
        model.$promise.then(() => {
            expect(model.$foo).toBe(false);
            expect(model.$bar).toBe(true);
        });
        model = res.get({id: 3});
        model.$promise.then(() => {
            expect(model.$foo).toBe(true);
            expect(model.$bar).toBe(true);
        });
    });

});

