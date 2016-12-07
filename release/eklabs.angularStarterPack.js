/**
 * AngularJS Starter Pack
 * @version v0.2.6
 * @link 
 */

'use strict';

angular.module('eklabs.angularStarterPack.config',[])
    .factory('$config', ['WEBAPP_CONFIG',function(WEBAPP_CONFIG){

        var parameters = angular.extend({}, WEBAPP_CONFIG);

        return {
            get: function (name) {
                return parameters[name];
            },
            getUploadPath : function(){
                return parameters['uploadPath']
            }
        }
    }]);
'use strict';


angular.module('eklabs.angularStarterPack.upload',['ngFileUpload'])
    .service('uploadImage', function($timeout, Upload){

        return function(file, path,token,callback){

            file.upload = Upload.upload({
                url     : path,
                method  : 'POST',
                headers : {
                    'Authorization' : token
                },
                file : file,
                fields : { type : file.type.split('/')[1]}
            });

            file.upload.then(function(response){
                $timeout(function () {
                    file.result = response.data;
                    return callback(response.data);
                });
            }, function(reason){
                return callback(reason);
            });

            file.upload.progress(function(evt){
                file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            })
        }

    });
'use strict';

angular.module('eklabs.angularStarterPack.jsonEditor',[
    'ui.ace'
]);
'use strict';

angular.module('eklabs.angularStarterPack.jsonEditor')
    .directive('demoJsonEditor', ['$log',function($log){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/json-editor/directives/editor/view.html',
            scope : {
                json        : '=?',
                callback    : '=?',
                options     : '=?',
                listeners   : '=?',
                height      : '=?'
            },link : function(scope){

                // -------------------------------------------------------------------------------------------------
                // --- OPTIONS
                // -------------------------------------------------------------------------------------------------
                scope.$watch('options', function(options){
                    // TODO - NO OPTIONS YET
                });

                // -------------------------------------------------------------------------------------------------
                // --- CALLBACK
                // -------------------------------------------------------------------------------------------------
                /**
                 * Default action of our directive
                 * @type {{valid: default_actions.valid}}
                 */
                var default_actions = {
                    valid : function(json){
                        $log.info('Valid JSON on demoJsonEditor directive',json);
                    }
                };
                /**
                 * Check if callback in params
                 */
                scope.$watch('callback', function(callback){
                    if(callback){
                        scope.actions = angular.extend({},default_actions,callback);
                    }else{
                        scope.actions = default_actions
                    }
                });

                // -------------------------------------------------------------------------------------------------
                // --- LISTENERS
                // -------------------------------------------------------------------------------------------------
                /**
                 * Default listeners for the directive
                 * @type {{onErrors: default_listeners.onErrors}}
                 */
                var default_listeners = {
                    onError : function(editorError){
                        //$log.error(editorError);
                    }
                };

                /**
                 * Check if a listener as params
                 */
                scope.$watch('listeners', function(listeners){
                    if(listeners){
                        scope.listener = angular.extend({},default_listeners,listeners);
                    }else{
                        scope.listener = default_listeners;
                    }
                });

                /**
                 * Errors
                 * Catch Error and send back
                 */
                scope.$watch('editorError', function(errors){
                    if(errors){
                        scope.listener.onError(errors);
                    }
                });

                // -------------------------------------------------------------------------------------------------
                // --- JSON
                // -------------------------------------------------------------------------------------------------
                scope.$watch('json', function(json){
                    scope.aceAvailable = false;

                    if(!json){
                        // --- Default json
                        scope.aceModel =  '{\n\t\n}';
                    }else{
                        scope.aceModel = scope.convertRequestParamsToJson(json);
                    }
                    scope.loadAce = moment().valueOf();
                });

                // -------------------------------------------------------------------------------------------------
                // --- JSON EDITOR
                // -------------------------------------------------------------------------------------------------
                /**
                 * Trigger to load ace editor
                 */
                scope.$watch('loadAce',function(loadAce){
                    scope.aceOption = {
                        mode: 'json',
                        require: ['ace/ext/language_tools'],
                        theme: 'chrome',
                        onLoad: function (_ace) {
                            var _session = _ace.getSession();

                            _session.on('changeAnnotation', function(){

                                var annot = _ace.getSession().getAnnotations();

                                if(!annot.length){
                                    scope.editorError = false;
                                    // --- transform and send to temp variable
                                    scope.currentJson = scope.convertToJson(_ace.getValue());
                                }else{
                                    // ---- Error on the model
                                    scope.editorError = annot[0];
                                }
                            } )
                        }
                    };
                    scope.aceAvailable = true;
                });

                /**
                 * Transforms params request attribute as valid json ;)
                 * @param params
                 * @returns {string}
                 */
                scope.convertRequestParamsToJson = function(params){

                    if(Array.isArray(params)){
                        var myJson = {};

                        angular.forEach(params, function(element){
                            myJson[element.key] = element.value;
                        });

                        return scope.convertToAce(myJson);

                    }else{
                        return scope.convertToAce(params);
                    }
                };
                /**
                 * Build params for functionality from ace
                 * @param json
                 */
                scope.convertAceToParams    = function(json,parent){

                    var myParams = [];

                    angular.forEach(json, function(value,key){
                        if(value instanceof Object){
                            myParams = myParams.concat(scope.convertAceToParams(value),parent+'.'+key);
                        }else{
                            myParams.push({
                                key :  (parent) ? parent+key : key,
                                value : value
                            })
                        }
                    });

                    return myParams;

                };


                /**
                 * Method to render well or params
                 * @param json
                 * @returns {string}
                 */
                scope.convertToAce = function(json){

                    var transform       = "",
                        previousChar    = "",
                        tabs            = [],
                        jsonString      = JSON.stringify(json);

                    angular.forEach(jsonString, function(char){
                        if(char == '{'){
                            tabs.push("\t");
                            transform += char + '\n'+tabs.join("");
                        }else if(char == ',' && (previousChar == '"'|| previousChar == 'e' || previousChar == 'd')){
                            transform += char + '\n'+tabs.join("");
                        }else if(char == '}'){
                            tabs.splice(0,1);
                            transform += '\n' +tabs.join("")+ char;
                        }else{
                            transform += char
                        }
                        previousChar = char;
                    });

                    return transform;
                };

                /**
                 * Little method to transform edited
                 * @param value
                 * @returns {*}
                 */
                scope.convertToJson = function(value){
                    if(!value){
                        return undefined
                    }else if(value instanceof Object){
                        return value;
                    }else{
                        return JSON.parse(value);
                    }
                };

                // -------------------------------------------------------------------------------------------------
                //                                                                                               CSS
                // -------------------------------------------------------------------------------------------------
                scope.$watch('height', function(height){
                    scope.currentHeight        = (height-20) || 800;
                    scope.maxHeightContainer    = height - 45;
                });
                //scope.aceMaxHeight = 260; //todo
                
                
            }
        }
    }]);
'use strict';

angular.module('eklabs.angularStarterPack.forms',[
    
]);
'use strict';

angular.module('eklabs.angularStarterPack.forms')
    .directive('myForm',function($log){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/forms/directives/my-form/myFormView.html',
            scope : {
                user        : '=',
                callback    : '=?'
            },link : function(scope){

                /**
                 * 
                 */
                scope.$watch('user', function(myUser){
                    scope.myUser = myUser;
                });


                /**
                 * Default Actions
                 * @type {{onValid: default_actions.onValid}}
                 */
                var default_actions = {
                  onValid : function(user){
                      $log.info('my user is : ',user)
                    }
                };

                /**
                 * Catch Callback
                 */
                scope.$watch('callback', function(callback){
                    if(callback instanceof Object){
                        scope.actions = angular.extend({},default_actions,callback);
                    }else{
                        scope.actions = default_actions;
                    }
                });

            }
        }
    });
'use strict';

angular.module('eklabs.angularStarterPack.user',['eklabs.angularStarterPack.config']);
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
'use strict';

angular.module('eklabs.angularStarterPack.user')
    .directive('myUser',function($log,User){
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/user/directives/my-user/view.html',
            scope : {
                user : '=?',
                callback : '=?'
            },link : function(scope){


                /**
                 *
                 */
                scope.$watch('callback',function(callback){
                    $log.info('Check callback',callback);

                    if(callback && callback.valid){
                        scope.isEditable = true;
                    }else{
                        scope.isEditable = false;
                    }
                });

                scope.$watch('user',function(user){
                    $log.info('test user change',user);
                    if(user){

                        scope.current_user = new User(user);
                        scope.user.birthDate = new Date(user.birthDate);
                    }else{
                        scope.current_user = new User();
                    }

                    console.log(scope.current_user);

                });

                /**
                 *
                 */
                scope.isModeEdition = false;
                scope.goToEdition = function(){
                    scope.isModeEdition = !scope.isModeEdition;
                    scope.userEdit = angular.extend({},scope.user);
                };

                /**
                 *
                 */
                scope.valid = function(user){
                    scope.isModeEdition = !scope.isModeEdition;
                    scope.user = angular.extend({},scope.userEdit);

                    scope.current_user.create().then(function(user){
                        scope.callback.valid(user);
                    },function(reason){
                        alert('toto');
                    });


                }


            }
        }
    })
'use strict';

angular.module('eklabs.angularStarterPack.user')
    .factory('User', function($config,$http,$q){

        var uri = $config.get('api')+'/users/';

        /**
         * Constructor
         * @param data
         * @constructor
         */
        var User  = function (data){
            if(data){
                this.name       = data.name;
                this.id         = data.id;
                this.photo      = data.photo;
                this.birthdate  = data.birthdate
            }
        };

        User.prototype = Object.create({});
        User.prototype.constructor = User;

        /**
         * Access to id attribute
         * @returns {*}
         */
        User.prototype.getId = function(){
            return this.id;
        };

        /**
         * Manage case no photo ;)
         * @returns {*}
         */
        User.prototype.getPicture = function(){
            return (this.photo) ? this.photo : 'http://91.134.241.60:8020/images/mbs.core/icons/user.png'
        };

        /**
         * Transform Object User to JSON for an API
         * @returns {{name: *, photo: *, birthdate: *}}
         */
        User.prototype.toApi = function(){
            return {
                name : this.name,
                photo : this.photo,
                birthdate : this.birthdate
            }
        };

        /**
         * Method to retrieve user information
         * @param id
         * @returns {*|jQuery.promise|promise.promise|Function|Promise}
         */
        User.prototype.get = function(id){

            var defer       = $q.defer(),
                accessUri   = uri + (id ? id : (this.id) ? this.id : undefined);

            $http.get(accessUri).then(function(response){
                defer.resolve(new User(response.data));
            },function(reason){
                defer.reject(reason)
            });

            return defer.promise;
        };

        /**
         * Method to create a new user
         * @returns {*|jQuery.promise|promise.promise|Function|Promise}
         */
        User.prototype.create = function(){
            var self = this,
                defer = $q.defer();

            $http.post(uri, this).then(function(response){
                self.id = response.data.id;
                defer.resolve(self);
            },function(reason){
                defer.reject(reason)
            });

            return defer.promise;

        };

        /**
         * Delete
         * @returns {promise.promise|*|Function|jQuery.promise|Promise}
         */
        User.prototype.delete = function(){
            var defer = $q.defer();

            $http.delete(uri+this.getId()).then(function(response){
                defer.resolve(response);
            },function(reason){
                defer.reject(reason)
            });

            return defer.promise;
        };

        /**
         * Update the current user
         * @returns {promise.promise|*|Function|jQuery.promise|Promise}
         */
        User.prototype.update = function(data){
            var defer = $q.defer();

            $http.put(uri+this.getId(),data).then(function(response){
                defer.resolve(response);
            },function(reason){
                defer.reject(reason)
            });

            return defer.promise;
        };

        /**
         * Make a copy of the current item 
         * @returns {User}
         */
        User.prototype.clone = function(){
            return new User(this);
        };

        return User;

    });
'use strict';

angular.module('eklabs.angularStarterPack.user')
    .factory('Users', function($config,$http,$q, User){

        var uri = $config.get('api')+'/users/';

        var Users  = function (data){
            this.ids = [];
            this.items = [];

            if(data){
                this.addItems(data);
            }
        };

        Users.prototype = Object.create({});
        Users.prototype.constructor = Users;

        /**
         * Find all Users from the database
         * @returns {*|jQuery.promise|promise.promise|Function|Promise}
         */
        Users.prototype.fetch = function(){

            var defer = $q.defer(),
                self = this;

            $http.get(uri).then(function(response){
                self.addItems(response.data);
                defer.resolve();
            },function(reason){
                defer.reject(reason)
            });

            return defer.promise;
        };
        /**
         * Add users to our list
         * @param items
         */
        Users.prototype.addItems = function(items){
            if(Array.isArray(items)){
                var self = this; // -- To keep the reference
                angular.forEach(items, function(item){
                    self.addItem(item);
                })
            }else{
                this.addItem(data);
            }
        };
        /**
         * Add a single user
         * @param item
         */
        Users.prototype.addItem = function(item){
            var user = new User(item);
            // --- Check if not already into our items list
            if(user.getId() && this.ids.indexOf(user.getId()) == -1){
                this.ids.push(user.getId());
                this.items.push(user);
            }
        };

        /**
         * Check the data from the list
         * @returns {boolean}
         */
        Users.prototype.isEmpty = function(){
            return this.ids.length == 0
        };

        // ------- RETURN THE OBJECT
        return Users;

    });
'use strict';

angular.module('eklabs.angularStarterPack',[
    'eklabs.angularStarterPack.config',
    'eklabs.angularStarterPack.upload',
    'eklabs.angularStarterPack.jsonEditor',
    'eklabs.angularStarterPack.forms',
    'eklabs.angularStarterPack.user'

]);
'use strict';

angular.module('eklabs.angularStarterPack')
    .filter('momentFormat', function() {

        return function (value, format) {
            var date = new Date(value);
            return moment(date).isValid() ? moment(date).format(format) : value;
        };

    });