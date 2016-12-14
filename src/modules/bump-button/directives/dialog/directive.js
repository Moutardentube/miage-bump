'use strict';

angular.module('eklabs.angularStarterPack.bumpButton')
    .directive('demoBumpDialog', ['$log', function ($log) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/bump-button/directives/dialog/view.html',
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
                })

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
    }]);