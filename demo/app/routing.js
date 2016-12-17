'use strict';

angular.module('demoApp')
    .config(function ($urlRouterProvider, $stateProvider) {

    $stateProvider
        // ------------------------------------------------------------------------------------------------
        // HOMEPAGE - Init the current value
        // ------------------------------------------------------------------------------------------------
        .state('default', {
            url : '/',
            controller : 'homepageCtrl',
            templateUrl : "pages/_homepage/homepageView.html"
        })

        // ------------------------------------------------------------------------------------------------
        // DEMO EDITOR Component
        // ------------------------------------------------------------------------------------------------
        .state('jsonEditor', {
            url : '/json-editor',
            controller : 'demoEditorCtrl',
            templateUrl : "pages/demoEditor/demoEditorView.html"
        })

        // ------------------------------------------------------------------------------------------------
        // DEMO FORM Component
        // ------------------------------------------------------------------------------------------------
        .state('bumpProfile', {
            url : '/bump-profile',
            controller : 'demoBumpProfileCtrl',
            templateUrl : "pages/demoBumpProfile/demoBumpProfileView.html"
        })


    ;



    
    $urlRouterProvider.otherwise('/');
});