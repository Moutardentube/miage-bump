'use strict';

angular.module('eklabs.angularStarterPack.bumpProfile', ['ngMaterial'])
    .directive('demoBumpProfile', ['$log', '$http', '$config', function ($log, $http, $config) {
        return {
            templateUrl: 'eklabs.angularStarterPack/modules/bump-profile/directives/editor/view.html',
            scope: {
                user: '='
            },
            link: function (scope) {
                scope.tagList = [];
                scope.bumps = [];
                scope.selectedTag = null;

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
                        return bump.tag.indexOf(tag) !== -1;
                    //Flatten nested tags within bumps
                    }).reduce(function (acc, curr) {
                        return acc.concat(curr.tag);
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
                    $http.get($config.get('api') + '/bump').then(function (response) {
                        //Filter invalid entries out then match on user
                        scope.bumps = response.data.filter(function (bump) {
                            return typeof bump === 'object' && bump.idUser == user;
                        });
                        $log.info(scope.bumps);
                        //Flatten nested tags within bumps
                        scope.tagList = scope.bumps.reduce(function (acc, curr) {
                            //Isolate new tags
                            var newTags = curr.tag.filter(function (item) {
                                return acc.indexOf(item) == -1
                            });

                            if (newTags.length > 0) {
                                return acc.concat(newTags);
                            }
                            return acc;
                        }, []);
                        $log.info('Tag list: ', scope.tagList);
                    }, function (response) {

                    });
                }
            }
        }
    }]);
