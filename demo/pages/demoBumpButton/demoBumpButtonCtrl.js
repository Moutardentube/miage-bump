'use strict';

angular.module('demoApp')
    .controller('demoBumpButtonCtrl', function ($scope){


        // ----------------------------------------------------------------------------------------------------
        // ---- PARAMS CATALOGUE
        // ----------------------------------------------------------------------------------------------------

        $scope.params = [{
            /**
             * Default
             */
            case        : 'Default Case',
            user        : undefined,
            url         : '',
            container   : 'iframe',
            tags        : undefined,
            callback    : undefined,
            options     : undefined
        }, {
            /**
             * Case User
             */
            case        : 'Case User',
            user        : {
                id      : '5865868b0532ac18c82349ad',
                name    : 'Ludo Babadjo'
            },
            url         : 'https://www.dealabs.com/bons-plans/magnum-de-15l-de-chouffe/296071',
            container   : 'iframe',
            tags        : undefined,
            callback    : undefined,
            options     : undefined

        }, {
            /**
             * Callback active
             */
            case        : 'Case Callback and Function',
            callback    : {
                valid : function (json) {
                    displayCode('Callback', json);
                }
            },
            options     : undefined
        }];

        $scope.chooseParams = function(index){
            // --- Define current status
            $scope.myUser       = $scope.params[index].user;
            $scope.myCallback   = $scope.params[index].callback;
            $scope.myUrl        = $scope.params[index].url;
            $scope.myContainer  = $scope.params[index].container;
            $scope.myTags       = $scope.params[index].tags;

            $scope.index        = index;
            $scope.haveResult   = false;
        };

        // --- Init
        $scope.chooseParams(0);

        // --- Update result viewer
        var displayCode = function (from, code, isError){

            $scope.haveResult   = true;

            $scope.result       = {
                code : code,
                isError : isError,
                title : from
            };
        };
        // ----------------------------------------------------------------------------------------------------
        // ---- DISPLAY CODE MODE
        // ----------------------------------------------------------------------------------------------------
        $scope.displayCode  = false;
        $scope.maxHeight    = $(window).height() - 250;

        $scope.showCode = function () {
            $scope.displayCode = !$scope.displayCode;
        };

        /**
         * Page description
         * @type {{title: string, icon: string, haveCodeSource: boolean}}
         */
        $scope.page         = {
            title : 'directive bump-button',
            haveCodeSource : true,
            code : [{
                link : 'pages/demoBumpButton/code/directive-button.html',
                language : 'html',
                title : 'Code HTML de la directive demo-bump'
            }, {
                link : 'pages/demoBumpButton/code/contract.json',
                language : 'json',
                title : 'Params available for the directive demo-bump'
            }]
        };

        /**
         * MODE Fullscreen
         */
        $scope.fullScreenMode   = true;
        $scope.hideParams       = false;
        $scope.fullScreen       = function () {
            $scope.hideParams = !$scope.hideParams;
        };

    });