'use strict';

/**
 * Crossdomain resources trusting
 */
angular.module('eklabs.angularStarterPack.bumpButton')
    .filter('trusted', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    });

angular.module('eklabs.angularStarterPack.bumpButton')
    .directive('demoBumpFrame', ['$log', function ($log) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/bump-button/directives/frame/view.html',
            scope       : {
                user        : '=?',
                url         : '=',
                callback    : '=?'
            },
            link: function (scope, element) {
                //Needed as the ng-onload event only fires once in the iframe lifetime
                element.find('iframe').on('load', function () {
                    scope.isLoading = false;
                    scope.$apply();
                });

                scope.$watch('user', function (user) {
                    console.log(user);
                    scope.myUser = user;
                });

                /*scope.$watch('url', function (url) {
                    console.log(url);
                    scope.myUrl = url;
                });*/

                scope.setUrl = function (e) {
                    if (e.keyCode !== 13) {
                        return;
                    }
                    scope.isLoading = true;

                    var url = e.target.value;
                    scope.url = url;
                    scope.myUrl = url;
                };

                var defaultActions = {
                    bump: function () {

                    },
                    onLoad: function (url) { //Only called once per iframe lifetime
                        $log.info('Loaded url: ', url);
                        scope.isLoading = false;
                        scope.$apply()
                    }
                };

                scope.actions = defaultActions;

                scope.$watch('callback', function (callback) {
                    if (callback instanceof Object) {
                        scope.actions = angular.extend({}, defaultActions, callback);
                    } else {
                        scope.actions = defaultActions;
                    }
                });
            }
        }
    }])
    /*.directive('demoReadyFrame', ['$log', function ($log) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/bump-button/directives/frame/view.html',
            scope       : {
                user        : '=?',
                url         : '=',
                callback    : '=?'
            },
            link: function (scope) {

            }
        }
    }])*/;