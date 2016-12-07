angular.module('eklabs.angularStarterPack.user')
    .directive('myUserForm',function($log,User,uploadImage,$config){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/user/directives/my-user-form/myUserForm.html',
            scope : {
                user        : '=',
                callback    : '=?',
                height      : '=?'
            },link : function(scope){


                // -------------------------------------------------------------------------------------------------
                // USER
                // -------------------------------------------------------------------------------------------------
                scope.$watch('user', function(user){
                    // --- Manage case no user
                    if(!user){
                        scope.currentUser = new User();
                    }else{
                        scope.currentUser = user.clone(); // --- make a copy of the object
                    }
                    // --- Check if is creation or edition
                    if(scope.currentUser.getId()){
                        scope.isCreation = false;
                    }else{
                        scope.isCreation = true;
                    }
                });

                // -------------------------------------------------------------------------------------------------
                // CSS
                // -------------------------------------------------------------------------------------------------
                scope.$watch('height', function(height){
                    if(height){
                        scope.current_height = height-110;
                    }else{
                        scope.current_height = 400;
                    }
                });

                // -------------------------------------------------------------------------------------------------
                // ACTIONS
                // -------------------------------------------------------------------------------------------------
                /**
                 * Go back to
                 */
                scope.cancel = function(){
                    scope.isLoading = false;
                    if(scope.callback && scope.callback.cancel){
                        scope.callback.cancel();
                    }else{
                        $log.warn('No method to go back ...');
                    }
                };
                /**
                 * Delete User
                 * todo : add a confirmation box
                 */
                scope.delete = function(){
                    scope.isLoading = true;
                    scope.currentUser.delete().then(function(){
                        scope.isLoading = false;
                        scope.cancel();
                    })
                };

                /**
                 * Save the current form
                 * => call two method
                 */
                scope.save = function(){
                    scope.isLoading = true;

                    uploadAnImage(function(link){
                        // --- If we have a link so we update the currentUser
                        if(link){
                            scope.currentUser.photo = link;
                        }

                        recordUser(function(){
                            scope.cancel();
                        })
                    })
                };
                /**
                 * Method to upload a file
                 * @param next
                 */
                var uploadAnImage = function(next){
                    if(scope.avatarUploaded){
                        uploadImage(scope.picFile, $config.getUploadPath(), false, function(response){
                            if(response){
                                next(response.link)
                            }else{
                                // ---- Error -> no next because we want stop
                                scope.errors = "Erreur durant la mise a jour de l'avatar"
                            }
                        })
                    }else{
                        next(null)
                    }
                };
                /**
                 * Method to update / create a user
                 * @param next
                 */
                var recordUser = function(next){
                    // --- Check if create or not
                    if(scope.isCreation){
                        scope.currentUser.create().then(function(){
                            next();
                        },function(reason){
                            scope.errors = reason
                        })
                    }else{
                        scope.currentUser.update(scope.currentUser.toApi()).then(function(){
                            next();
                        },function(reason){
                            scope.errors = reason
                        })
                    }
                };

                // ---------------------------------------------------------------------------------------------------
                //                                                                                AVATAR CONTROLS
                // ---------------------------------------------------------------------------------------------------
                /**
                 *
                 * @type {boolean}
                 */
                scope.avatarUploaded = false;

                /**
                 *
                 * @param file
                 */
                scope.changeAvatar = function(file){
                    scope.picFile       = file;
                    scope.avatarUploaded = true;
                };

                /**
                 *
                 */
                scope.cancelAvatar = function(){
                    scope.avatarUploaded    = false;
                };

            }
        }
    });