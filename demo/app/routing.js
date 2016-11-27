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
        .state('formEditor', {
            url : '/form-editor',
            controller : 'demoFormCtrl',
            templateUrl : "pages/demoForm/demoFormView.html"
        })

        // ------------------------------------------------------------------------------------------------
        // DEMO BUMP Component
        // ------------------------------------------------------------------------------------------------
        .state('bumpButton', {
            url : '/bump-button',
            controller : 'demoBumpCtrl',
            templateUrl : "pages/demoBump/demoBumpView.html"
        })

        // ------------------------------------------------------------------------------------------------
        // DEMO BUMP MATCH Component
        // ------------------------------------------------------------------------------------------------
        .state('bumpButton', {
            url : '/bump-match',
            controller : 'demoBumpMatchCtrl',
            templateUrl : "pages/demoBumpMatch/demoBumpMatchView.html"
        })


    ;



    
    $urlRouterProvider.otherwise('/');
});