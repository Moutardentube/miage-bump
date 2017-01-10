describe('Bump Factory', function () {

    var Bump,
        httpMock;

    // Before each test load our api.bump module
    beforeEach(angular.mock.module('ui.ace'));
    beforeEach(angular.mock.module('miage.bump'));

    // ---- Inject Default config for the test
    angular.module('miage.bump')
        .constant('WEBAPP_CONFIG', {
            api: 'http://91.134.241.60:3080/resources'
        });

    // Before each test set our injected Bump factory (_Bump_) to our local Bump variable
    beforeEach(inject(function (_Bump_, _$httpBackend_) {
        Bump        = _Bump_;
        httpMock    = _$httpBackend_;
    }));

    // A simple test to verify the Bump factory exists
    it('should exist', function () {
        expect(Bump).toBeDefined();
    });

    // A set of tests for our Bump.get() method
    describe('.get(id)', function () {
        // A simple test to verify the method exists
        it('should exist', function () {
            expect(Bump.prototype.get).toBeDefined();
        });

        it('should return one Bump object if it exists', function () {
            var spy = jasmine.createSpy('success');

            httpMock.expectGET('http://91.134.241.60:3080/resources/bump/1')
                .respond(200, {
                    id  : '1',
                    url : 'test.donf'
                });

            Bump.prototype.get('1').then(spy);

            httpMock.flush();

            expect(spy).toHaveBeenCalledWith(new Bump({
                id  : '1',
                url : 'test.donf'
            }));
        });
    });

    // A set of tests for our Bump.create() method
    describe('.create()', function () {
        // A simple test to verify the method exists
        it('should exist', function () {
            expect(Bump.prototype.create).toBeDefined();
        });

        it('should return one Bump object with an id if it has been created', function () {
            var spy = jasmine.createSpy('success');

            httpMock.expectPOST('http://91.134.241.60:3080/resources/bump/', {})
                .respond(200, {
                    id: '1'
                });

            Bump.prototype.create().then(spy);

            httpMock.flush();

            expect(spy).toHaveBeenCalledWith(angular.merge(Bump.prototype, { id: 1 }));
        });
    });

    // A set of tests for our Bump.delete() method
    describe('.delete()', function () {
        // A simple test to verify the method exists
        it('should exist', function () {
            expect(Bump.prototype.delete).toBeDefined();
        });

        it('should return a 2xx code if it has been deleted', function () {
            var spy = jasmine.createSpy('success');

            //we expect the id the be undefined since this is not an instance of Bump
            httpMock.expectDELETE('http://91.134.241.60:3080/resources/bump/undefined')
                .respond(200);

            Bump.prototype.delete().then(spy);

            httpMock.flush();

            //Since the success callback has been called, it means a 2xx code was returned
            expect(spy).toHaveBeenCalled();
        });
    });
});