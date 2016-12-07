'use strict';

'use strict';

angular.module('demoApp')
    .controller('demoUserCtrl', function($scope){

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
            title : 'directive my-user-tab',
            haveCodeSource : true,
            code : [{
                link : 'pages/demoUser/code/directive.html',
                language : 'html',
                title : 'Code HTML de la directive demo-user'
            },{
                link : 'pages/demoUser/code/params.json',
                language : 'json',
                title : 'Params available for the directive demo-user'
            }]
        };

        /**
         * MODE Fullscreen
         */
        $scope.fullScreenMode = true;
        $scope.hideParams     = true;
        $scope.fullScreen = function(){
            $scope.hideParams = !$scope.hideParams;
        };

    });