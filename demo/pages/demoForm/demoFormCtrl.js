'use strict';

'use strict';

angular.module('demoApp')
    .controller('demoFormCtrl', function($scope){


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
             * Case User
             */
            case        : 'Case User',
            user        : {
                lastName    : 'Nom',
                firstName   : 'Prénom'
            },
            callback    : {
                onValidate: function (user) {
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