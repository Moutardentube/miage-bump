'use strict';

angular.module('eklabs.angularStarterPack.bump')
    .factory('Bumps', function ($log, $config, $http, $q, Bump) {

        var route = $config.get('api') + '/bump/';

        var Bumps  = function (data) {
            this.ids    = [];
            this.items  = [];

            if (typeof data === 'object') {
                this.addItems(data);
            }
        };

        Bumps.prototype = Object.create({});
        Bumps.prototype.constructor = Bumps;

        /**
         * Find all Bumps from the database
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bumps.prototype.fetch = function () {
            return $http.get(route).then(function (response) {
                this.addItems(response.data);
            }.bind(this));
        };

        /**
         * Retrieve bumps from a specific user
         * @param {string} userId
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bumps.prototype.findByUser = function (userId) {
            var defer = $q.defer();

            this.fetch().then(function () {
                var userBumps = this.items.filter(function (bump) {
                    return bump.userId === userId;
                });
                defer.resolve(userBumps);
            }.bind(this), function (reason) {
                defer.reject(reason);
            });

            return defer.promise;
        };

        /**
         * Add bumps to our list
         * @param {Array.<Bump>} items
         */
        Bumps.prototype.addItems = function (items) {
            if (Array.isArray(items)) {
                angular.forEach(items, function (item) {
                    this.addItem(item);
                }.bind(this));
            } else {
                this.addItem(data);
            }
        };

        /**
         * Add a single bump
         * @param {Bump} item
         */
        Bumps.prototype.addItem = function (item) {
            try {
                var bump = new Bump(item);
                // --- Check if not already into our items list
                if (bump.getId() && this.ids.indexOf(bump.getId()) === -1) {
                    this.ids.push(bump.getId());
                    this.items.push(bump);
                }
            } catch (e) {
                $log.warn(e.message);
            }
        };

        /**
         * Check the data from the list
         * @returns {boolean}
         */
        Bumps.prototype.isEmpty = function () {
            return this.ids.length == 0
        };

        // ------- RETURN THE OBJECT
        return Bumps;
    });