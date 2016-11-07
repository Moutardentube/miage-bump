'use strict';

angular.module('eklabs.angularStarterPack.user')
    .factory('User', function($config,$http,$q){

        var User  = function (){
            this.uri = $config.get('api')+'/users/';
        };

        User.prototype = Object.create({});
        User.prototype.constructor = User;

        // ----- Get an user from the API
        User.prototype.get = function(id){

            var defer = $q.defer();

            $http.get(this.uri+id).then(function(response){
                defer.resolve(new User(response.data));
            },function(reason){
                defer.reject(reason)
            });

            return defer.promise;
        };

        return User;

    });