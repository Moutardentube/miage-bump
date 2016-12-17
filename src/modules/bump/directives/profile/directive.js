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
                    var newTags;
                    //Flatten nested tags within bumps
                    scope.userTags = scope.userBumps.reduce(function (acc, curr) {
                        //Isolate new tags
                        newTags = curr.tags.filter(function (item) {
                            return acc.indexOf(item) == -1
                        });
                        return acc.concat(newTags);
                    }, []);

                    $log.info('Tag list: ', scope.userTags);
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
            }
        }
    });
