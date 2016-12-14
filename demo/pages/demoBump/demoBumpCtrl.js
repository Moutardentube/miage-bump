'use strict';

'use strict';

angular.module('demoApp')
    .controller('demoBumpCtrl', function($scope){


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
            callback    : undefined
        },{
            /**
             * Case User
             */
            case        : 'Case User',
            user        : {
                id      : '',
                name    : 'Ludo Babadjo'
            },
            url         : 'https://www.dealabs.com/bons-plans/magnum-de-15l-de-chouffe/296071',
            callback    : {
                onEnter     : function (user, url) {

                },
                onValidate  : function (user) {
                    displayCode('onValidate', user);
                }
            }
        },{
            /**
             * Case JSON
             */
            case        : 'Case inject Json',
            options     : undefined,
            json        : {"hello" : "world"},
            callback    : undefined,
            listeners   : undefined

        },{
            /**
             * Callback active
             */
            case        : 'Case Callback and Function',
            options     : undefined,
            json        : undefined,
            callback    : {
                valid : function(json){
                    displayCode('Callback : valid',json);
                }
            },
            listeners  : {
                onError : function(errors){
                    displayCode('Listeners : onError',errors,true);
                }
            }
        }];

        $scope.chooseParams = function(index){
            // --- Define current status
            $scope.myUser       = $scope.params[index].user;
            $scope.myCallback   = $scope.params[index].callback;
            $scope.myUrl        = $scope.params[index].url;

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
            title : 'directive bump-button',
            haveCodeSource : true,
            code : [{
                link : 'pages/demoBump/code/directive.html',
                language : 'html',
                title : 'Code HTML de la directive demo-bump-button'
            },{
                link : 'pages/demoBump/code/contract.json',
                language : 'json',
                title : 'Params available for the directive demo-bump-button'
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