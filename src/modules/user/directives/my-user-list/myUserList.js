'use strict';

angular.module('eklabs.angularStarterPack.user')
    .directive('myUserList',function($log,Users){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/user/directives/my-user-list/myUserList.html',
            scope : {
                callback    : '=?',
                height      : '=?',
                refresh     : '=?' // --- trigger to reload all information
            },link : function(scope){
                
                // --- Add a loading message
                scope.isLoading = true;
                scope.errors    = false;

                // --- Load all 
                var loadUsers = function(){
                    scope.users = new Users();
                    
                    scope.users.fetch().then(function(){
                        scope.isLoading = false;
                    },function(error){
                        scope.isLoading = false;
                        scope.errors = error;
                    })
                };

                // --- Refresh stuff
                scope.$watch('refresh', function(refresh){
                    loadUsers();
                });

                // --- CSS Stuff
                scope.$watch('height', function(height){
                    if(height){
                        scope.current_height = height;
                    }else{
                        scope.current_height = 400;
                    }
                });
                
                // --- Actions to edit an user
                scope.editUser = function(user){
                    if(scope.callback && scope.callback.editUser){
                        scope.callback.editUser(user);
                    }else{
                        $log.warn('No function to edit an user', user);
                    }
                };

                // --- Filter
                scope.filter = {
                    name : undefined,
                    pictureActive : false,
                };

                scope.filterFn = function(element){

                    var filter = true;

                    // ---- test on name
                    if(scope.filter.name){
                        var reg = new RegExp(scope.filter.name,'gi'),
                            found = element.name.match(reg);

                        if(!found){
                            return false;
                        }
                    }
                    // ---- test on picture
                    if(scope.filter.pictureActive){
                        filter = (element.photo != undefined);
                    }

                    return filter;

                }
            }
        }
    });