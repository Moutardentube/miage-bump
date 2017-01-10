describe('Testing tops directive', function () {
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
        var element = angular.element('<div><bump-tops user="user" user-tags="userTags"></bump-tops></div>');
        element.data('$bumpProfileController', parentCtrl);
        var compiledElement = compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    it('should be an empty list',function () {
        var list = directiveElem.find('md-list');
        expect(list.length).toBeGreaterThan(0);
        expect(list.children().length).toEqual(0);
    });

    it('should watch the update of an user and its tags', function () {
        scope.user = {
            id: 1
        };
        scope.userTags = {
            tag1: 1,
            tag2: 2,
            tag3: 3
        };
        directiveElem.scope().$apply();

        var listItems = directiveElem.find('md-list-item');
        expect(listItems.length).toEqual(3);
    });
});