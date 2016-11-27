'use strict';

angular.module('eklabs.angularStarterPack.bumpMatch')
    .directive('demoBumpMatch', ['$log', function ($log) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/bump-match/directives/button/view.html',
            scope       : {
                user        : '=',
                callback    : '=?'
            }
            
        }
    }]);