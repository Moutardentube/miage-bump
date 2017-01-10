describe('Testing profile directive', function () {
    var compile,
        scope,
        directiveElem;

    beforeEach(function () {
        angular.mock.module('miage.bump');

        inject(function (_$compile_, _$rootScope_) {
            compile = _$compile_;
            scope   = _$rootScope_;
        });

        directiveElem = getCompiledElement();
    });

    /**
     * Load the current element
     * @returns {Object}
     */
    function getCompiledElement() {
        var element = angular.element('<bump-profile></bump-profile>');
        var compiledElement = compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    it('should be an empty view',function () {
        var view = directiveElem.find('ui-view');
        expect(view.length).toBeGreaterThan(0);
        expect(view.children().length).toEqual(0);
    });
});