'use strict';

angular.module('miage.bump.button')
    .directive('bumpDialog', function ($log) {
        return {
            templateUrl : 'miage.bump/modules/button/directives/dialog/view.html',
            scope       : {
                user        : '=',
                url         : '=?',
                tags        : '=?',
                callback    : '=?'
            },
            link: function (scope) {
                scope.$watch('user', function (user) {
                    scope.myUser = user;
                });

                scope.$watch('url', function (url) {
                    scope.myUrl = url;
                });

                var defaultActions = {
                    onValidate: function (user) {
                        $log.info('User is ', user)
                    }
                };

                scope.$watch('callback', function (callback) {
                    if (callback instanceof Object) {
                        scope.actions = angular.extend({}, defaultActions, callback);
                    } else {
                        scope.actions = defaultActions;
                    }
                });
            }
        }
    });