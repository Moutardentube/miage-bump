'use strict';

angular.module('eklabs.angularStarterPack.bumpButton')
    .directive('demoBumpButton', ['$log', '$mdDialog', function ($log, $mdDialog) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/bump-button/directives/button/view.html',
            scope       : {
                user        : '=',
                url         : '=',
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
                    onBump: function (user, url, e) {
                        //TODO: generate tags from url contents and add them to user
                        scope.tags = ['Tag 1', 'Tag 2', 'Tag 3'];
                        scope.showDialog(e);
                    }
                };

                scope.$watch('callback', function (callback) {
                    if (callback instanceof Object) {
                        scope.actions = angular.extend({}, defaultActions, callback);
                    } else {
                        scope.actions = defaultActions;
                    }
                });

                scope.showDialog = function() {
                    $mdDialog.show({
                        template:
                            '<md-dialog aria-label="Bump?">' +
                            '   <md-dialog-content>' +
                            '       <md-list layout="column" layout-padding>' +
                            '           <md-list-item layout="row" layout-align="space-between center">' +
                            '                <md-input-container>' +
                            '                    <input placeholder="Renseignez un tag"' +
                            '                           ng-model="tags[0]" />' +
                            '                </md-input-container>' +
                            '                <md-button ng-click="addTag(tags[0])">' +
                            '                    <md-icon md-svg-src="material-design:add"></md-icon>' +
                            '                </md-button>' +
                            '           </md-list-item>' +
                            '           <md-list-item layout="row" layout-align="space-between center"' +
                            '                         ng-repeat="tag in tags" ng-if="$index > 0">' +
                            '                <md-input-container>' +
                            '                    <input ng-model="tag" />' +
                            '                </md-input-container>' +
                            '                <md-button ng-click="deleteTag($index)">' +
                            '                    <md-icon md-svg-src="material-design:delete"></md-icon>' +
                            '                </md-button>' +
                            '           </md-list-item>' +
                            '       </md-list>' +
                            '   </md-dialog-content>' +
                            '   <md-dialog-actions>' +
                            '       <md-button ng-click="closeDialog()">Cancel</md-button>' +
                            '       <md-button ng-click="confirmBump()">Bump!</md-button>' +
                            '   </md-dialog-actions>' +
                            '</md-dialog>',
                        locals: {
                            tags: scope.tags,
                            url : scope.myUrl
                        },
                        controller: DialogController
                    });
                    function DialogController($scope, $mdDialog, tags, url) {
                        tags.unshift('');
                        $scope.tags = tags;

                        $scope.closeDialog = function() {
                            $mdDialog.hide();
                        };
                        $scope.confirmBump = function() {
                            //TODO: save tags and url for user
                            $scope.closeDialog();
                        };
                        $scope.addTag = function (tag) {
                            if (tag === '') {
                                return;
                            }
                            $scope.tags.splice(1, 0, tag);
                            $scope.tags[0] = '';
                        };
                        $scope.editTag = function (index) {

                        };
                        $scope.deleteTag = function (index) {
                            $scope.tags.splice(index, 1);
                        };
                    }
                }
            }
        }
    }]);