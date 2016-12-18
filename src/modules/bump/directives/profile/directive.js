'use strict';

angular.module('eklabs.angularStarterPack.bump', ['ngMaterial'])
    .directive('bumpProfile', function ($log, Bumps) {
        return {
            templateUrl: 'eklabs.angularStarterPack/modules/bump/directives/profile/view.html',
            scope: {
                user: '='
            },
            link: function (scope) {
                scope.bumps = new Bumps();
                scope.userBumps = [];
                scope.userTags = [];
                scope.userTagCount = 0;
                scope.trendingTags = [];
                scope.selectedTag = null;

                scope.bumps.fetch();

                scope.$watch('user', function (user) {
                    scope.myUser = user;

                    if (user === undefined) {
                        return;
                    }
                    getBumps();
                    getFriendsBumps();
                    getMatchingProfiles();
                });

                scope.getRelatedTags = function (tag) {
                    scope.selectedTag = tag;
                    //Filter unrelated bumps out
                    scope.relatedTags = scope.userBumps.filter(function (bump) {
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

                    $log.info('Related tags: ', scope.relatedTags);
                };

                function getBumps() {
                    scope.userBumps = scope.bumps.filterByUser(scope.user.id);
                    //Flatten nested tags within bumps
                    scope.userTags = scope.userBumps.reduce(function (acc, curr) {
                        return acc.concat(curr.tags);
                    //Count each tag occurrences
                    }, []).reduce(function (acc, curr) {
                        acc[curr] = (acc[curr] || 0) + 1;
                        //Increment total tag count for user
                        scope.userTagCount++;

                        return acc;
                    }, {});

                    $log.info('Tag list: ', scope.userTags);
                    $log.info(scope.userTagCount);
                }

                function getFriendsBumps() {
                    var friendsBumps = scope.bumps.filterByUsers(scope.user.friends);
                    //Flatten nested tags within bumps
                    scope.trendingTags = friendsBumps.reduce(function (acc, curr) {
                        return acc.concat(curr.tags);
                    //Count each tag occurrences
                    }, []).reduce(function (acc, curr) {
                        acc[curr] = (acc[curr] || 0) + 1;

                        return acc;
                    }, {});

                    $log.info('Trending tags: ', scope.trendingTags);
                }

                function getMatchingProfiles() {
                    if (scope.userTagCount === 0) {
                        return;
                    }
                    var strangersMatches    = {},
                        excludedUsers       = scope.user.friends.concat([scope.user.id]),
                        strangersBumps      = scope.bumps.filterByUsers(excludedUsers, true);
                    //Flatten and merge tags for each user
                    var strangersTags = strangersBumps.reduce(function (acc, curr) {
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
                            if (tag in scope.userTags) {
                                //A shared tag increases the match
                                softMatch  += 1 / Object.keys(tagsCounts).length;

                                tagRatio    = (count / strangerTagCount);
                                deepRatio   = (count / strangerTagCount) / (scope.userTags[tag] / scope.userTagCount);
                                //The closer the tag fits amongst the others, deeper the match is
                                deepMatch  += tagRatio *= deepRatio < 1 ? deepRatio : 1 / deepRatio;
                            }
                        });
                        //Each stranger match is 50% soft 50% deep
                        strangersMatches[strangerId] = softMatch * 0.5 + deepMatch * 0.5;
                    });

                    $log.info('User matches: ', strangersMatches);
                }
            }
        }
    });
