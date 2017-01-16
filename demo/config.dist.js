'use strict';

/**
 * Example config, if your app needs somethings
 */

angular.module('demoApp')
    .constant('WEBAPP_CONFIG', {

        platform : 'DEV',

        name : 'MIAGE Bump',
        
        version : '0.3.2',

        api         : 'http://91.134.241.60:3080/resources',
        uploadPath  : 'http://91.134.241.60:3080/data'
    });