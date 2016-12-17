'use strict';

angular.module('eklabs.angularStarterPack.bump', ['ngMaterial'])
    .directive('bumpProfile', function ($log, Bumps) {
        return {
            templateUrl: 'eklabs.angularStarterPack/modules/bump/directives/profile/view.html',
            scope: {
                user: '='
            },
            link: function (scope) {
                scope.tagList = [];
                scope.bumps = [];
                scope.selectedTag = null;
                var bumps = new Bumps();

                scope.$watch('user', function (user) {
                    scope.myUser = user;

                    if (user === undefined) {
                        return;
                    }
                    fetchBumps(user);
                });

                scope.getRelatedTags = function (tag) {
                    scope.selectedTag = tag;
                    //Filter unrelated bumps out
                    scope.relatedTags = scope.bumps.filter(function (bump) {
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

                function fetchBumps(user) {
                    bumps.findByUser(user).then(function (response) {
                        scope.bumps = response;
                        var newTags;
                        //Flatten nested tags within bumps
                        scope.tagList = scope.bumps.reduce(function (acc, curr) {
                            //Isolate new tags
                            newTags = curr.tags.filter(function (item) {
                                return acc.indexOf(item) == -1
                            });
                            return acc.concat(newTags);
                        }, []);
                        $log.info('Tag list: ', scope.tagList);
                    }, function (reason) {
                        $log.error('Bumps fetching failed: ' + reason);
                    });
                }
            }
        }
    });
