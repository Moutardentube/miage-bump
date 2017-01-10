describe('Testing matches directive', function () {
    var compile,
        scope,
        directiveElem,
        httpMock;

    beforeEach(function () {
        angular.mock.module('miage.bump', function ($controllerProvider) {
            $controllerProvider.register('ProfileCtrl', {});
        });

        inject(function (_$compile_, _$rootScope_, _$httpBackend_) {
            compile     = _$compile_;
            scope       = _$rootScope_;
            httpMock    = _$httpBackend_;
        });

        directiveElem = getCompiledElement();
    });

    /**
     * Load the current element
     * @returns {Object}
     */
    function getCompiledElement() {
        //Mock the required directive controller
        var parentCtrl = {
            getBumps: function () {}
        };
        //Inject the mocked controller into a dummy parent directive
        var element = angular.element('<div><bump-matches user="user" user-matches="userMatches"></bump-matches></div>');
        element.data('$bumpProfileController', parentCtrl);
        var compiledElement = compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    it('should be an empty grid list',function () {
        var gridList = directiveElem.find('md-grid-list');
        expect(gridList.length).toBeGreaterThan(0);
        expect(gridList.children().length).toEqual(0);
    });

    it('should watch the update of an user and its matches', function () {
        scope.user = {
            id: 1
        };
        scope.userMatches = [
            {
                name: 'match1'
            },
            {
                name: 'match2'
            },
            {
                name: 'match2'
            }
        ];
        directiveElem.scope().$apply();

        var gridTiles = directiveElem.find('md-grid-tile');
        expect(gridTiles.length).toEqual(3);
    });
});