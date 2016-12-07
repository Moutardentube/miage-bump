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