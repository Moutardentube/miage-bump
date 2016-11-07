'use strict';

'use strict';

angular.module('demoApp')
    .controller('demoUserCtrl', function($scope,$mdDialog){


        // ----------------------------------------------------------------------------------------------------
        // ---- PARAMS CATALOGUE
        // ----------------------------------------------------------------------------------------------------

        $scope.params = [{
            /**
             * Default
             */
            case        : 'Default Case',
            user        : undefined,
            callback    : undefined
        },{
            /**
             * Case user
             */
            case       : 'Case user',
            user    : {
                name : 'toto',
                photo : 'http://127.0.0.1:9100/images/photos/F60.png',
                birthDate : "2000-01-01"
            },
            callback : {
                valid : function(user){
                    displayCode('onValid', user)
                }
            }
        }];

        $scope.chooseParams = function(index){
            // --- Define current status
            $scope.myUser    = $scope.params[index].user;
            $scope.myCallback = $scope.params[index].callback;

            $scope.index          = index;
            $scope.refresh        = moment().valueOf();
            $scope.haveResult     = false;
        };

        // --- Init
        $scope.chooseParams(1);

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
            title : 'directive my user',
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
        $scope.hideParams     = false;
        $scope.fullScreen = function(){
            $scope.hideParams = !$scope.hideParams;
        };

    });