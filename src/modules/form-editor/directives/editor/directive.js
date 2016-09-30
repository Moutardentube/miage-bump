'use strict';

angular.module('eklabs.angularStarterPack.formEditor')
    .directive('demoFormEditor', ['$log', function ($log) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/form-editor/directives/editor/view.html',
            scope       : {
                user        : '=',
                callback    : '=?'
            },
            link: function (scope) {
                scope.$watch('user', function (user) {
                    scope.myUser = user;
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
    }]);