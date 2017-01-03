'use strict';

angular.module('miage.bump.profile')
    .directive('bumpTops', function ($log) {
        return {
            require: '^^bumpProfile',
            templateUrl: 'miage.bump/modules/profile/directives/tops/view.html',
            scope: {
                user    : '=',
                userTags: '=?'
            },
            link: function (scope, element, attrs, profileCtrl) {
                scope.selectedTag   = null;
                scope.relatedTags   = [];

                //Watching the scope properties together opens for some decreasing in the number of calls made
                //as fetching from the parent directive is not always needed
                scope.$watchGroup(['user', 'userTags'], function (newValues) {
                    var user        = newValues[0],
                        userTags    = newValues[1];
                    //If isolated scope was empty and both values are set (injection)
                    if (scope.myUser === undefined && scope.myTags === undefined
                    && (user !== undefined && userTags !== undefined)) {
                        scope.myUser = user;
                        scope.myTags = userTags;

                        return;
                    }
                    //Update tags
                    scope.myTags = userTags;
                    //If user is the same, whether it be another digest cycle or a programmatic gimmick
                    if (user === scope.myUser) {
                        return;
                    }
                    scope.myUser = user;
                    //If there is no user set
                    if (user === undefined) {
                        return;
                    }
                    //Else fetch bumps from parent directive
                    profileCtrl.getBumps();
                });

                scope.getRelatedTags = function (tag) {
                    profileCtrl.getRelatedTags(tag);
                    scope.relatedTags = profileCtrl.relatedTags;
                    scope.selectedTag = tag;
                };
            }
        }
    });
