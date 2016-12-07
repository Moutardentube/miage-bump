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