'use strict';

angular.module('eklabs.angularStarterPack.bump')
    .factory('Bump', function ($config, $http, $q) {

        var route = $config.get('api') + '/bump/';

        /**
         * @typedef {Object} Bump
         * @property {string} id
         * @property {string} userId
         * @property {string} img
         * @property {string} url
         * @property {Array.<string>} tags
         */

        /**
         * Constructor
         * @param {Object} data
         * @param {string} data.id
         * @param {string} data.idUser
         * @param {string} data.img
         * @param {string} data.url
         * @param {Array.<string>} data.tag
         * @constructor
         */
        var Bump = function (data) {
            if (typeof data === 'object') {
                this.id     = data.id;
                this.userId = data.idUser;
                this.img    = data.img;
                this.url    = data.url;
                this.tags    = data.tag;
            } else {
                throw new TypeError('The following Bump is malformed: ' + angular.toJson(data));
            }
        };

        Bump.prototype = Object.create({});
        Bump.prototype.constructor = Bump;

        /**
         * Access to id attribute
         * @returns {string}
         */
        Bump.prototype.getId = function () {
            return this.id;
        };

        /**
         * Manage case no photo ;)
         * @returns {string}
         */
        Bump.prototype.getPicture = function () {
            //TODO: upload a default image
            return (this.photo) ? this.photo : 'http://91.134.241.60:8020/images/mbs.core/icons/bump.png'
        };

        /**
         * Transform Object Bump to JSON for an API
         * @returns {{idUser: string, img: string, url: string, tag: Array.<string>}}
         */
        Bump.prototype.toApi = function () {
            return {
                idUser  : this.name,
                img     : this.img,
                url     : this.url,
                tag     : this.tag
            }
        };

        /**
         * Method to retrieve bump information
         * @param {string} id
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bump.prototype.get = function (id) {
            var defer       = $q.defer(),
                accessRoute = route + (id ? id : (this.id) ? this.id : undefined);

            $http.get(accessRoute).then(function (response) {
                defer.resolve(new Bump(response.data));
            },function (reason) {
                defer.reject(reason)
            });

            return defer.promise;
        };

        /**
         * Method to create a new bump
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bump.prototype.create = function () {
            var defer   = $q.defer();

            $http.post(route, this).then(function (response) {
                this.id = response.data.id;
                defer.resolve(this);
            }.bind(this), function(reason){
                defer.reject(reason)
            });

            return defer.promise;

        };

        /**
         * Delete
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bump.prototype.delete = function () {
            return $http.delete(route+this.getId());
        };

        /**
         * Update the current bump
         * @param {Object} data
         * @param {string=} data.userId
         * @param {string=} data.img
         * @param {string=} data.url
         * @param {Array.<string>=} data.tags
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bump.prototype.update = function (data) {
            return $http.put(route + this.getId(), data);
        };

        /**
         * Make a copy of the current item 
         * @returns {Bump}
         */
        Bump.prototype.clone = function(){
            return new Bump(this);
        };

        return Bump;
    });