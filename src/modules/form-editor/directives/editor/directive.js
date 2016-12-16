'use strict';

angular.module('eklabs.angularStarterPack.formEditor',['ngMaterial'])
    .directive('demoFormEditor', ['$log', '$http', function ($log,$http) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/form-editor/directives/editor/view.html',
            scope       : {
                 user    : '=',
            },
            link: function (scope) {


              //Init vars
              var urlApi = "http://91.134.241.60:3080/resources/";
              scope.tagList = [];
              scope.allBump = [];

                scope.$watch('user', function (myUser) {
                    scope.myUser = myUser;
                    scope.user=scope.myUser;
                    afficheBump(myUser);
                });

                var defaultActions = {
                    onValidate: function (user) {
                        $log.info('User is ', user)
                    }
                };

        console.log(scope.user.user_id);

        scope.displayTagonTag = function(nom) {
          scope.displayTag = nom;
          getAllWithoutName(scope.bump,nom);
        }


        function afficheBump(user){

          $http({
            method: 'GET',
            url: urlApi + 'bump'
          }).then(function successCallback(response) {

              scope.allBump = response.data.filter(function(item) { return typeof item === 'object'});
              scope.tagList = scope.allBump.reduce(function(accumulator,currentValue) {
                var filterTagList = currentValue.tag.filter(function (item) {
                  return accumulator.indexOf(item) == -1
                })

                if (filterTagList !== []) {
                  return accumulator.concat(filterTagList);
                }

                return accumulator;

              }, []);

              console.log("response", response);
              console.log("allBump", scope.allBump);
              console.log("tagList", scope.tagList);

            }, function errorCallback(response) {
              console.log("requete get échoué");
              console.log(response);
            });


        }

    }
}
}]);
