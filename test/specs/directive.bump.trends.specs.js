describe('Testing trends directive', function () {
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
            getFriendsBumps: function () {}
        };
        //Inject the mocked controller into a dummy parent directive
        var element = angular.element('<div><bump-trends user="user" trending-tags="trendingTags"></bump-trends></div>');
        element.data('$bumpProfileController', parentCtrl);
        var compiledElement = compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    it('should be an empty content container',function () {
        var content = directiveElem.find('md-content');
        expect(content.length).toBeGreaterThan(0);
        expect(content.children().length).toEqual(0);
    });

    it('should watch the update of an user and its friends tags', function () {
        scope.user = {
            id: 1
        };
        scope.trendingTags = {
            tag1: 1,
            tag2: 2,
            tag3: 3
        };
        directiveElem.scope().$apply();

        var buttons = directiveElem.find('button');
        expect(buttons.length).toEqual(3);
    });
});