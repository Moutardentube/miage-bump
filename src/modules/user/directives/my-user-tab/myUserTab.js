'use strict';

angular.module('eklabs.angularStarterPack.user')
    .directive('myUserTab',function(User){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/user/directives/my-user-tab/myUserTab.html',
            scope : {
                height      : '=?'
            },link : function(scope){

                // -------------------------------------------------------------------------------------------------
                // NAVIGATION
                // -------------------------------------------------------------------------------------------------

                // -- Default tabs available
                scope.tabs = [
                    {
                        title   : 'User List',
                        icon    : 'people',
                        directive : 'my-user-list',
                        disabled : false
                    }
                ];

                scope.navigateTo = function(state){
                    switch(state){
                        case 'create' :
                            // --- Disable the navigation
                            scope.tabs[0].disabled  = true;
                            scope.createNotAvailable= true;

                            // --- Prepare the new tabs
                            scope.currentUser       = new User();
                            scope.tabs.push({
                                title : "Create a new user",
                                icon    : 'person',
                                directive : 'my-user-form',
                                disabled : false
                            });
                            break;
                        case 'edit' :
                            // --- Disable the navigation
                            scope.tabs[0].disabled  = true;
                            scope.createNotAvailable= true;

                            // --- Prepare the new tabs
                            scope.tabs.push({
                                title : "Edit user "+scope.currentUser.name,
                                icon    : 'person',
                                directive : 'my-user-form',
                                disabled : false
                            });
                            break;
                    }
                };

                // -------------------------------------------------------------------------------------------------
                // METHOD BY DIRECTIVE
                // -------------------------------------------------------------------------------------------------
                scope.actionsList = {
                    editUser : function(user){
                        scope.currentUser = user;
                        scope.navigateTo('edit');
                    }
                };

                scope.actionsForm = {
                    cancel : function(){
                        scope.tabs[0].disabled = false;
                        scope.createNotAvailable= false;
                        scope.tabs.pop();
                        scope.refresh = moment().valueOf();
                    }
                };

                // -------------------------------------------------------------------------------------------------
                // CSS
                // -------------------------------------------------------------------------------------------------
                scope.$watch('height', function(height){
                    if(height){
                        scope.current_height = height -50; //--glich nav
                    }else{
                        scope.current_height = 500;
                    }
                });

                // --- Launch trigger to initialize the view
                scope.refresh = moment().valueOf();
            }
        }
    });