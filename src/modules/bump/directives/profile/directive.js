'use strict';

angular.module('eklabs.angularStarterPack.bump')
    .directive('bumpProfile', function ($log, Bumps, User, Users, $q) {
        return {
            templateUrl: 'eklabs.angularStarterPack/modules/bump/directives/profile/view.html',
            scope: {
                user: '='
            },
            controller: function ($scope, $state) {
                const PARENT_STATE = 'bumpProfile';
                //Some variables are controller properties since children directives need to access them
                this.bumps          = new Bumps();
                this.users          = new Users();
                this.userBumps      = [];
                this.relatedTags    = [];
                this.userTagCount   = 0;

                $scope.selectedNav  = 'tops';
                $scope.isLoading    = true;

                $q.all(this.bumps.fetch(), this.users.fetch()).then(function () {
                    $state.go(PARENT_STATE + '.' + $scope.selectedNav);
                    $scope.isLoading = false;
                });

                //Scope properties are still needed to update children directives scopes
                $scope.$watch('user', function (user) {
                    this.myUser         = user;
                    $scope.myUser       = user;
                }.bind(this));

                $scope.$watch('userTags', function (userTags) {
                    this.userTags       = userTags;
                }.bind(this));

                $scope.$watch('trendingTags', function (trendingTags) {
                    this.trendingTags   = trendingTags;
                }.bind(this));

                $scope.$watch('userMatches', function (userMatches) {
                    this.userMatches    = userMatches;
                }.bind(this));

                this.getRelatedTags = function (tag) {
                    //Filter unrelated bumps out
                    this.relatedTags = this.userBumps.filter(function (bump) {
                        return bump.tags.indexOf(tag) !== -1;
                    //Flatten nested tags within bumps
                    }).reduce(function (acc, curr) {
                        return acc.concat(curr.tags);
                    //Exclude self
                    }, []).filter(function (sibling) {
                        return sibling !== tag;
                    //Count each tag occurrences
                    }).reduce(function (acc, curr) {
                        acc[curr] = (acc[curr] || 0) + 1;

                        return acc;
                    }, {});

                    $log.info('[Profile Controller] Related tags: ', this.relatedTags);
                };

                this.getBumps = function () {
                    this.userBumps  = this.bumps.filterByUser($scope.myUser.id);
                    this.userTagCount = 0;
                    //Flatten nested tags within bumps
                    $scope.userTags = this.userBumps.reduce(function (acc, curr) {
                        return acc.concat(curr.tags);
                    //Count each tag occurrences
                    }, []).reduce(function (acc, curr) {
                        acc[curr] = (acc[curr] || 0) + 1;
                        //Increment total tag count for user
                        this.userTagCount++;

                        return acc;
                    }.bind(this), {});

                    $log.info('[Profile Controller] Tag list: ', $scope.userTags);
                    $log.info('[Profile Controller] Tag count: ', this.userTagCount);
                };

                this.getFriendsBumps = function () {
                    var friendsBumps    = this.bumps.filterByUsers($scope.myUser.friends);
                    //Flatten nested tags within bumps
                    $scope.trendingTags = friendsBumps.reduce(function (acc, curr) {
                        return acc.concat(curr.tags);
                    //Count each tag occurrences
                    }, []).reduce(function (acc, curr) {
                        acc[curr] = (acc[curr] || 0) + 1;

                        return acc;
                    }, {});

                    $log.info('[Profile Controller] Trending tags: ', $scope.trendingTags);
                };

                this.getMatchingProfiles = function () {
                    if (this.userTagCount === 0) {
                        if (this.bumps.filterByUser($scope.myUser.id).length === 0) {
                            $log.info('[Profile Controller] User has no bumps yet');

                            return;
                        }
                        this.getBumps();
                    }
                    var userMatches     = {},
                        userPromises    = [],
                        excludedUsers   = $scope.myUser.friends.concat([$scope.myUser.id]),
                        strangersBumps  = this.bumps.filterByUsers(excludedUsers, true);
                    //Flatten and merge tags for each user
                    var strangersTags   = strangersBumps.reduce(function (acc, curr) {
                        acc[curr.userId] = (acc[curr.userId] || []).concat(curr.tags);

                        return acc;
                    }, {});
                    //Compute match for each stranger
                    angular.forEach(Object.keys(strangersTags), function (strangerId) {
                        var softMatch           = 0,
                            deepMatch           = 0,
                            strangerTagCount    = 0,
                            tagRatio,
                            deepRatio;
                        //Indexed count for each tag
                        var tagsCounts = strangersTags[strangerId].reduce(function (acc, curr) {
                            acc[curr] = (acc[curr] || 0) + 1;
                            //Increment tag count for stranger
                            strangerTagCount++;

                            return acc;
                        }, {});
                        //Increase match for every matching tag
                        angular.forEach(tagsCounts, function (count, tag) {
                            if (tag in $scope.userTags) {
                                //A shared tag increases the match
                                softMatch  += 1 / Object.keys(tagsCounts).length;

                                tagRatio    = (count / strangerTagCount);
                                deepRatio   = (count / strangerTagCount) / ($scope.userTags[tag] / this.userTagCount);
                                //The closer the tag fits amongst the others, deeper the match is
                                deepMatch  += tagRatio *= deepRatio < 1 ? deepRatio : 1 / deepRatio;
                            }
                        }.bind(this));
                        //Each stranger match is 50% soft 50% deep
                        userMatches[strangerId] = softMatch * 0.5 + deepMatch * 0.5;
                        //Request info for stranger
                        //userPromises.push(new User().get(strangerId));
                    }.bind(this));
                    //Populate matches from requests and update scope
                    $q.all(userPromises).then(function (results) {
                        $scope.userMatches = Object.keys(userMatches).map(function (strangerId) {
                            //Get User resource and add its match level
                            return angular.merge({
                                match: userMatches[strangerId]
                            }, this.findUser(strangerId));
                        }.bind(this));

                        $log.info('[Profile Controller] User matches: ', $scope.userMatches);
                    }.bind(this));
                };

                //Find User within the whole collection instead of firing a new request for each matching user
                this.findUser = function (userId) {
                    return this.users.items.find(function (user) {
                        return user.id === userId;
                    });
                };
            }
        }
    });
