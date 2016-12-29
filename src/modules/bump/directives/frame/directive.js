'use strict';

/**
 * Crossdomain resources trusting
 */
angular.module('eklabs.angularStarterPack.bump')
    .filter('trusted', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    });

angular.module('eklabs.angularStarterPack.bump')
    .directive('bumpFrame', ['$log', function ($log) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/bump/directives/frame/view.html',
            scope       : {
                user        : '=?',
                url         : '=',
                container   : '=?',
                tags        : '=?',
                callback    : '=?'
            },
            link: function (scope, element) {
                //Needed as the ng-onload event only fires once in the iframe lifetime
                element.find('iframe').on('load', function () {
                    scope.isLoading = false;
                    scope.$apply();
                });

                var urlInput = element.find('#input-url');

                scope.$watch('user', function (user) {
                    scope.myUser = user;
                });
                scope.$watch('url', function (url) {
                    scope.myUrl = typeof url === 'string' && url.length > 0 ? url : 'about:blank';
                    scope.isLoading = true;

                    urlInput.prop('value', url);
                    urlInput.triggerHandler('focus');
                    urlInput.triggerHandler('blur');
                });
                scope.$watch('container', function (container) {
                    scope.myContainer = container;
                });
                scope.$watch('tags', function (tags) {
                    scope.myTags = tags;
                });

                scope.setUser = function (e) {

                };

                scope.setUrl = function (e) {
                    if (e.keyCode !== 13) {
                        return;
                    }
                    var url = e.target.value;

                    if (url === scope.myUrl) {
                        return;
                    }
                    scope.isLoading = true;
                    scope.myUrl = url;
                };

                var defaultActions = {
                    onLoad: function (url) { //Only called once per iframe lifetime
                        $log.info('Loaded url: ', url);
                        scope.isLoading = false;
                        scope.$apply();
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
    }]);