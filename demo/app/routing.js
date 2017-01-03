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
        // DEMO BUMP Component
        // ------------------------------------------------------------------------------------------------
        .state('bumpButton', {
            url: '/bump-button',
            controller: 'demoBumpButtonCtrl',
            templateUrl: "pages/demoBumpButton/demoBumpButtonView.html"
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