'use strict';

'use strict';

angular.module('demoApp')
    .controller('demoFormCtrl', function($scope, $http){


        // ----------------------------------------------------------------------------------------------------
        // ---- PARAMS CATALOGUE
        // ----------------------------------------------------------------------------------------------------
 
        $scope.params = [{
            /**
             * Default
             */
            case        : 'Oscar Amzalag',
            user    : {
                user_id : "1",
            },
        },{
            /**
             * Case User
             */
            case        : 'Anis Mezdari',
            user    : {
                user_id : "2",
            },
        },{
            /**
             * Case JSON
             */
            case        : 'Clement Chaudat',
            user    : {
                user_id : "3",
            },

        },{
            /**
             * Case JSON
             */
            case        : 'Eugene De Rastignac',
            user    : {
                user_id : "4",
            },

        },{
            /**
             * Case JSON
             */
            case        : 'Aurelien Garret',
            user    : {
                user_id : "5",
            },

        },{
            /**
             * Callback active
             */
            case        : 'Ludo Badjo',
            user    : {
                user_id : "6",
            },
        }];

        $scope.chooseParams = function(index){
            // --- Define current status
            $scope.myUser       = $scope.params[index].user;
            $scope.myCallback   = $scope.params[index].callback;

            $scope.index        = index;
            $scope.refresh      = moment().valueOf();
            $scope.haveResult   = false;
        };

        // --- Init
        $scope.chooseParams(0);

        // --- Update result viewer
        var displayCode = function(from,code,isError){

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

        $scope.showCode = function(){
            $scope.displayCode = !$scope.displayCode;
        };

        /**
         * Page description
         * @type {{title: string, icon: string, haveCodeSource: boolean}}
         */
        $scope.page         = {
            title : 'directive form-editor',
            haveCodeSource : true,
            code : [{
                link : 'pages/demoForm/code/directive.html',
                language : 'html',
                title : 'Code HTML de la directive demo-form-editor'
            },{
                link : 'pages/demoForm/code/contract.json',
                language : 'json',
                title : 'Params available for the directive demo-form-editor'
            }]
        };

        /**
         * MODE Fullscreen
         */
        $scope.fullScreenMode = true;
        $scope.hideParams     = false;
        $scope.fullScreen = function(){
            $scope.hideParams = !$scope.hideParams;
        };

    });