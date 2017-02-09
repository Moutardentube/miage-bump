describe('Testing profile directive', function () {
    var compile,
        scope,
        directiveElem,
        controller,
        ctrlScope,
        httpMock,
        Bump,
        Bumps,
        User,users

    beforeEach(function () {
        angular.mock.module('miage.bump');
        angular.mock.module('ui.router');

        inject(function (_$compile_, _$rootScope_, _$httpBackend_, _$state_, _Bump_, _Bumps_, _User_, _Users_) {
            compile     = _$compile_;
            scope       = _$rootScope_;
            httpMock    = _$httpBackend_;
            Bump        = _Bump_;
            Bumps       = _Bumps_;
            User        = _User_;
            Users       = _Users_;
            //Templates requests are intercepted
            spyOn(_$state_, 'go').and.returnValue('');
        });

        httpMock.expectGET('http://91.134.241.60:3080/resources/bump/')
            .respond(200, [
                new Bump({
                    id: '1'
                }),
                new Bump({
                    id: '2'
                })
            ]);
        httpMock.expectGET('http://91.134.241.60:3080/resources/users/')
            .respond(200, [
                new User({
                    id: '1'
                }),
                new User({
                    id: '2'
                })
            ]);

        directiveElem   = getCompiledElement();
        controller      = directiveElem.controller('bumpProfile');
        ctrlScope       = directiveElem.isolateScope() || directiveElem.scope();

        httpMock.flush();
    });

    afterEach(function () {
        //httpMock.verifyNoOutstandingExpectation();
    });

    /**
     * Load the current element
     * @returns {Object}
     */
    function getCompiledElement() {
        var element = angular.element('<bump-profile user="user"></bump-profile>');
        var compiledElement = compile(element)(scope);
        scope.$digest();

        return compiledElement;
    }

    it('should be an empty view', function () {
        var view = directiveElem.find('ui-view');
        expect(view.length).toBeGreaterThan(0);
        expect(view.children().length).toEqual(0);
    });

    it('should fetch all users and bumps', function () {
        expect(ctrlScope.isLoading).toBeFalsy();
        expect(controller.bumps).toEqual(new Bumps([
            {
                id: '1'
            }, {
                id: '2'
            }
        ]));
        expect(controller.users).toEqual(new Users([
            new User({
                id: '1'
            }),
            new User({
                id: '2'
            })
        ]));
    });

    it('should watch the update of an user', function () {
        scope.user = {
            id: '1'
        };
        ctrlScope.$apply();

        expect(ctrlScope.myUser).toEqual({
            id: '1'
        });
        expect(controller.myUser).toEqual({
            id: '1'
        });
    });

    it('should watch the update of custom properties', function () {
        ctrlScope.userTags      = 'userTags';
        ctrlScope.trendingTags  = 'trendingTags';
        ctrlScope.userMatches   = 'userMatches';
        ctrlScope.$apply();

        expect(controller.userTags).toEqual('userTags');
        expect(controller.trendingTags).toEqual('trendingTags');
        expect(controller.userMatches).toEqual('userMatches');
    });

    it('should get tags from an user bumps', function () {
        scope.user = {
            id: '1'
        };
        controller.bumps = new Bumps([
            {
                id      : '1',
                idUser  : '1',
                tag     : [
                    'Tag 1'
                ]
            }, {
                id      : '2',
                idUser  : '1',
                tag     : [
                    'Tag 1',
                    'Tag 2'
                ]
            }, {
                id      : '3',
                idUser  : '2',
                tag     : [
                    'Tag 3'
                ]
            }
        ]);
        ctrlScope.$apply();
        controller.getBumps();

        expect(controller.userBumps).toEqual([
            new Bump({
                id      : '1',
                idUser  : '1',
                tag     : [
                    'Tag 1'
                ]
            }),
            new Bump({
                id      : '2',
                idUser  : '1',
                tag     : [
                    'Tag 1',
                    'Tag 2'
                ]
            })
        ]);
        expect(ctrlScope.userTags).toEqual({
            'Tag 1': 2,
            'Tag 2': 1
        });
        expect(controller.userTagCount).toEqual(3);
    });

    it('should get related tags from an user bumps', function () {
        controller.userBumps = [
            new Bump({
                id      : '1',
                tag     : [
                    'Tag 1'
                ]
            }),
            new Bump({
                id      : '2',
                tag     : [
                    'Tag 1',
                    'Tag 2'
                ]
            }),
            new Bump({
                id      : '3',
                tag     : [
                    'Tag 1',
                    'Tag 2',
                    'Tag 3'
                ]
            })
        ];

        controller.getRelatedTags('Tag 1');

        expect(controller.relatedTags).toEqual({
            'Tag 2': 2,
            'Tag 3': 1
        });
    });

    it('should get bumps from an user friends', function () {
        scope.user = {
            id: '1',
            friends: [
                '2',
                '3'
            ]
        };
        controller.bumps = new Bumps([
            {
                id: '1',
                idUser: '1',
                tag: [
                    'Tag 1'
                ]
            }, {
                id: '2',
                idUser: '2',
                tag: [
                    'Tag 1',
                    'Tag 2'
                ]
            }, {
                id: '3',
                idUser: '3',
                tag: [
                    'Tag 1',
                    'Tag 2',
                    'Tag 3'
                ]
            }
        ]);
        ctrlScope.$apply();

        controller.getFriendsBumps();
        ctrlScope.$apply();

        expect(ctrlScope.trendingTags).toEqual({
            'Tag 1': 2,
            'Tag 2': 2,
            'Tag 3': 1
        });
    });

    it('it should get matching profiles from an user', function () {
        scope.user = {
            id: '1',
            friends : [
                '2'
            ]
        };
        controller.bumps = new Bumps([
            {
                id      : '1',
                idUser  : '1',
                tag     : [
                    'Tag 1',
                    'Tag 3'
                ]
            }, {
                id      : '2',
                idUser  : '2',
                tag     : [
                    'Tag 2'
                ]
            }, {
                id      : '3',
                idUser  : '3',
                tag     : [
                    'Tag 1',
                    'Tag 2',
                    'Tag 3'
                ]
            }, {
                id      : '4',
                idUser  : '4',
                tag     : [
                    'Tag 1',
                    'Tag 2',
                    'Tag 3',
                    'Tag 4'
                ]
            }
        ]);
        ctrlScope.$apply();

        controller.getMatchingProfiles();
        ctrlScope.$apply();

        expect(ctrlScope.userMatches).toEqual([
            {
                'match': 0.5 //soft match weight
                * 2 //shared tags count
                / 3 //stranger tag count
                + 0.5 //deep match weight
                * (
                    (
                        1 //stranger shared tag count
                        / 3 //stranger total tag count
                    ) * (
                        1 //user shared tag count
                        / 3 //stranger total tag count
                    ) / (
                        1 //user shared tag count
                        / 2 //user total tag count
                    ) * 2 //shared tags count
                )
            }, {
                'match': 0.5 * 2 / 4 + 0.5 * ((1 / 4) * (1 / 4) / (1 / 2) * 2)
            }
        ]);
    });

    it('should find an user within the whole user collection given an id', function () {
        var found = controller.findUser('2');

        expect(found).toEqual(new User({
            id: '2'
        }));
    });
});