describe('Testing button directive', function () {
    var compile,
        scope,
        httpMock,
        dialog,
        q,
        Bump;

    beforeEach(function () {
        //Needed in order to get the SVG icon set called in time
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000;

        angular.mock.module('miage.bump');

        inject(function (_$compile_, _$rootScope_, _$httpBackend_, _$mdDialog_, _$q_, _Bump_) {
            compile     = _$compile_;
            scope       = _$rootScope_;
            httpMock    = _$httpBackend_;
            dialog      = _$mdDialog_;
            q           = _$q_;
            Bump        = _Bump_;
        });
    });

    afterEach(function () {
        httpMock.verifyNoOutstandingExpectation();
    });

    /**
     * Load the current element
     * @returns {Object}
     */
    function getCompiledElement() {
        var element = angular.element('<bump-button ' +
            'user="user" ' +
            'url="url" ' +
            'container="container" ' +
            'tags="tags" ' +
            'callback="callback"></bump-button>');
        var compiledElement = compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    it('should have a button', function () {
        //Mocks the call to the icon set that gets triggered during the $digest cycle
        httpMock.whenGET(/\.svg$/).respond('<svg></svg>');
        //Therefore the directive has to be compiled after
        var compiledElement = getCompiledElement();

        var button = compiledElement.find('button');
        expect(button.length).toBeGreaterThan(0);
    });

    it('should update its isolate scope when its scope change', function () {
        httpMock.whenGET(/\.svg$/).respond('<svg></svg>');
        var compiledElement = getCompiledElement();

        scope.user = {
            id: 1
        };
        scope.url = 'test.donf';
        scope.container = 'test';
        scope.tags = [
            'Tag1',
            'Tag2',
            'Tag3'
        ];
        scope.callback = {
            onTest: function () {
                return 'test';
            }
        };

        compiledElement.scope().$apply();
        var isolateScope = compiledElement.isolateScope();

        expect(isolateScope.myUser.id).toEqual(1);
        expect(isolateScope.myUrl).toEqual('test.donf');
        expect(isolateScope.myContainer).toEqual('test');
        expect(isolateScope.myTags).toEqual([
            'Tag1',
            'Tag2',
            'Tag3'
        ]);
        expect(Object.keys(isolateScope.actions)).toContain('onTest');
        expect(isolateScope.actions.onTest()).toEqual('test');
    });

    it('should display a material design dialog', function () {
        httpMock.whenGET(/\.svg$/).respond('<svg></svg>');
        var compiledElement = getCompiledElement();

        compiledElement.scope().$apply();

        spyOn(dialog, 'show').and.callThrough();

        compiledElement.find('button').triggerHandler('click');

        expect(dialog.show).toHaveBeenCalled();
    });

    it('should create a bump with predefined tags', function () {
        httpMock.whenGET(/\.svg$/).respond('<svg></svg>');
        var compiledElement = getCompiledElement();

        var deferred = q.defer();
        var promiseMock = deferred.promise;

        scope.user  = {
            id: 1
        };
        scope.url   = 'test.donf';
        scope.tags  = [
            'Tag 1',
            'Tag 2',
            'Tag 3'
        ];

        compiledElement.scope().$apply();

        spyOn(dialog, 'show').and.returnValue(promiseMock);

        compiledElement.find('button').triggerHandler('click');

        expect(compiledElement.isolateScope().myFoundTags).toEqual(scope.tags);

        httpMock.expectPOST('http://91.134.241.60:3080/resources/bump/', new Bump({
            idUser  : 1,
            url     : 'test.donf',
            tag     : [
                'Tag 2',
                'Tag 3'
            ] //The actual dialogs adds an empty tag that gets stripped out
        }).toApi())
            .respond(200, { id: 1 });

        deferred.resolve(scope.tags);

        httpMock.flush(null, 1); //Flush all pending requests (POST Bump), skipping the first one (SVG icon)
    });

    it('should create a bump with computed tags after querying an url', function () {
        httpMock.whenGET(/\.svg$/).respond('<svg></svg>');
        var compiledElement = getCompiledElement();

        var deferred        = q.defer(),
            promiseMock     = deferred.promise,
            expectedTags    = ['test', 'donf'];

        scope.user  = {
            id: 1
        };
        scope.url   = 'test.donf';

        compiledElement.scope().$apply();

        spyOn(dialog, 'show').and.returnValue(promiseMock);

        httpMock.expectGET('test.donf')
            .respond(200, '<!DOCTYPE html>' +
                '<html>' +
                '   <head>' +
                '       <title>test@donf</title>' +
                '   </head>' +
                '   <body>' +
                '       <h1>test@donf</h1>' +
                '   </body>' +
                '</html>');

        compiledElement.find('button').triggerHandler('click');

        httpMock.flush(null, 1); //Flush all pending requests (GET url), skipping the first one (SVG icon)

        expect(compiledElement.isolateScope().myFoundTags).toEqual(expectedTags);

        httpMock.expectPOST('http://91.134.241.60:3080/resources/bump/', new Bump({
            idUser  : 1,
            url     : 'test.donf',
            tag     : [
                'donf'
            ] //The actual dialogs adds an empty tag that gets stripped out
        }).toApi())
            .respond(200, { id: 1 });

        deferred.resolve(expectedTags);

        scope.$apply();

        httpMock.flush(null, 1); //Flush all pending requests (POST Bump), skipping the first one (SVG icon)
    });
});