'use strict';

angular.module('miage.bump.config', [])
    .factory('$config', function (WEBAPP_CONFIG) {
        var parameters = angular.extend({}, WEBAPP_CONFIG);

        return {
            get: function (name) {
                return parameters[name];
            }
        }
    });