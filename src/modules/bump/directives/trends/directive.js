'use strict';

angular.module('eklabs.angularStarterPack.bump')
    .directive('bumpTrends', function ($log) {
        return {
            require: '^^bumpProfile',
            templateUrl: 'eklabs.angularStarterPack/modules/bump/directives/trends/view.html',
            scope: {
                user        : '=',
                trendingTags: '=?'
            },
            link: function (scope, element, attrs, profileCtrl) {
                scope.maxCount = 0;
                //Watching the scope properties together opens for some decreasing in the number of calls made
                //as fetching from the parent directive is not always needed
                scope.$watchGroup(['user', 'trendingTags'], function (newValues) {
                    var user            = newValues[0],
                        trendingTags    = newValues[1];
                    //If isolated scope was empty and both values are set (injection)
                    if (scope.myUser === undefined && scope.myTrends === undefined
                    && (user !== undefined && trendingTags !== undefined)) {
                        scope.myUser    = user;
                        scope.myTrends  = trendingTags;

                        return;
                    }
                    //Update tags
                    scope.myTrends      = trendingTags;
                    //Update tag count
                    if (typeof trendingTags === 'object') {
                        scope.maxCount = Object.keys(trendingTags).reduce(function (acc, curr) {
                           return acc > trendingTags[curr] ? acc : trendingTags[curr];
                        }, 0);
                    }
                    $log.info(scope.maxCount);
                    //If user is the same, whether it be another digest cycle or a programmatic gimmick
                    if (user === scope.myUser) {
                        return;
                    }
                    scope.myUser        = user;
                    //If there is no user set
                    if (user === undefined) {
                        return;
                    }
                    //Else fetch bumps from parent directive
                    profileCtrl.getFriendsBumps();
                });
            }
        }
    });
