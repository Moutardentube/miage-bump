describe('Testing button directive', function () {
    var compile,
        scope,
        httpMock;

    beforeEach(function () {
        //Needed in order to get the SVG icon set called in time
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

        angular.mock.module('miage.bump');

        inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
            compile     = _$compile_;
            scope       = _$rootScope_;
            httpMock    = _$httpBackend_;
        });
    });

    /**
     * Load the current element
     * @returns {Object}
     */
    function getCompiledElement() {
        var element = angular.element('<bump-button></bump-button>');
        var compiledElement = compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    it('should have a button', function () {
        //Mocks the call to the icon set that gets triggered during the $digest cycle
        httpMock.whenGET(/\.svg$/).respond('<svg></svg>');

        var compiledElement = getCompiledElement();

        var button = compiledElement.find('button');
        expect(button.length).toBeGreaterThan(0);
    });
});