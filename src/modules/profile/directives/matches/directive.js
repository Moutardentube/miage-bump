'use strict';

angular.module('miage.bump.profile')
    .directive('bumpMatches', function ($log) {
        return {
            require: '^^bumpProfile',
            templateUrl: 'miage.bump/modules/profile/directives/matches/view.html',
            scope: {
                user        : '=',
                userMatches : '=?'
            },
            link: function (scope, element, attrs, profileCtrl) {
                //Watching the scope properties together opens for some decreasing in the number of calls made
                //as fetching from the parent directive is not always needed
                scope.$watchGroup(['user', 'userMatches'], function (newValues) {
                    var user        = newValues[0],
                        userMatches = newValues[1];
                    //If isolated scope was empty and both values are set (injection)
                    if (scope.myUser === undefined && scope.myMatches === undefined
                        && (user !== undefined && userMatches !== undefined)) {
                        scope.myUser    = user;
                        scope.myMatches = userMatches;

                        return;
                    }
                    //Update matches
                    scope.myMatches = userMatches;
                    //If user is the same, whether it be another digest cycle or a programmatic gimmick
                    if (user === scope.myUser) {
                        return;
                    }
                    scope.myUser    = user;
                    //If there is no user set
                    if (user === undefined) {
                        return;
                    }
                    //Else fetch bumps from parent directive
                    profileCtrl.getMatchingProfiles();
                });
            }
        }
    });
