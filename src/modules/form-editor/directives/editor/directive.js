'use strict';

angular.module('eklabs.angularStarterPack.formEditor',['ngMaterial'])
    .directive('demoFormEditor', ['$log', '$http', function ($log, $http) {
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

          scope.displayTagonTag = function(nom) {

            scope.displayTag = nom;



            scope.allSousTag = scope.allBump.filter(function (item) { return item.tag !== nom });

            scope.underTag = scope.allSousTag.filter(
              function (item) { return item.tag.indexOf(nom) !== -1 }
            ).reduce(
              function (a, b) { return a.concat(b.tag) }, []
            ).map(
              function (item) {
                return {tag: item, count : 1}
              }
            ).reduce(
              function (accumulator,currentValue) {
                var alreadyThere = accumulator.reduce(function(a,b) {
                  if (b.tag === currentValue.tag){
                    a.value = true;
                    a.index = a.currentIndex;
                  }
                  a.currentIndex++
                  return a }, {value: false, index: -1, currentIndex : 0})

                if (alreadyThere.value){
                  accumulator[alreadyThere.index].count++;
                }
                else {
                  accumulator.push(currentValue);
                }
                return accumulator;

              }, []).filter(function (item) {
                return item.tag !== nom})

              console.log(scope.underTag);
          }


        function afficheBump(user){
          console.log(user);
          $http({
            method: 'GET',
            url: urlApi + 'bump'
          }).then(function successCallback(response) {

              scope.allBump = response.data.filter(
                function(item) { return typeof item === 'object'}
              ).filter(function(item){ return item.idUser == user.user_id});

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

        function getAllWithoutName(bump, name){

          scope.tags = [];
          angular.forEach(bump, function(value, key) {
            var tag = value.tag;
            var bumpCount = value.bumpCount;
            if(tag != name){
              scope.tags.push(value);
            }

          });
          console.log(scope.tags);
        }
    }
}
}]);
