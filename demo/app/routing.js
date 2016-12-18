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

        .state('myForm', {
            url : '/my-form',
            controller : 'demoFormCtrl',
            templateUrl : "pages/demoform/demoFormView.html"
        })

        .state('myForm2', {
            url : '/my-form-classique',
            controller : 'demoUserCtrl',
            templateUrl : "pages/demoUser/demoUserView.html"
        })

        // ------------------------------------------------------------------------------------------------
        // DEMO BUMP Component
        // ------------------------------------------------------------------------------------------------
        .state('bumpButton', {
            url: '/bump-button',
            controller: 'demoBumpCtrl',
            templateUrl: "pages/demoBumpButton/demoBumpView.html"
        })

        .state('bumpProfile', {
            url : '/bump-profile',
            controller : 'demoBumpProfileCtrl',
            templateUrl : "pages/demoBumpProfile/demoBumpProfileView.html"
        })

        .state('bumpProfile.tops', {
            url: '/tops',
            template: '<bump-tops user="myUser" user-tags="userTags"></bump-tops>'
        })

        .state('bumpProfile.trends', {
            url: '/trends',
            template: '<bump-trends user="myUser" trending-tags="trendingTags"></bump-trends>'
        })

        .state('bumpProfile.matches', {
            url: '/matches',
            template: '<bump-matches user="myUser" user-matches="userMatches"></bump-matches>'
        })


    ;



    
    $urlRouterProvider.otherwise('/');
});