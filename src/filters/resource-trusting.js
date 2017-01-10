'use strict';

/**
 * Crossdomain resources trusting
 */
angular.module('miage.bump')
    .filter('trusted', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    });