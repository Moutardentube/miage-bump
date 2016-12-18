'use strict';

angular.module('demoApp')
    .controller('demoBumpProfileCtrl', function ($scope, $log, $http, WEBAPP_CONFIG){


        // ----------------------------------------------------------------------------------------------------
        // ---- PARAMS CATALOGUE
        // ----------------------------------------------------------------------------------------------------

        $scope.params = [{
            /**
             * Default
             */
            case    : 'Default case',
            user    : undefined
        }];

        $scope.chooseParams = function (index) {
            // --- Define current status
            $scope.myUser       = $scope.params[index].user;
            $scope.myCallback   = $scope.params[index].callback;

            $scope.index        = index;
            $scope.refresh      = moment().valueOf();
            $scope.haveResult   = false;
        };

        // --- Init
        $scope.chooseParams(0);
        //TODO: use a third-party factory instead
        $http.get(WEBAPP_CONFIG.api + '/users').then(function (response) {
            var users = response.data.filter(function (user) {
                return typeof user === 'object';
            }).map(function (user) {
                return {
                    case:   user.name,
                    user:   user
                }
            });
            $scope.params = $scope.params.concat(users);
        });

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
            title : 'directive bump-profile',
            haveCodeSource : true,
            code : [{
                link : 'pages/demoBumpProfile/code/directive.html',
                language : 'html',
                title : 'Code HTML de la directive demo-bump-profile'
            },{
                link : 'pages/demoBumpProfile/code/contract.json',
                language : 'json',
                title : 'Params available for the directive demo-bump-profile'
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
