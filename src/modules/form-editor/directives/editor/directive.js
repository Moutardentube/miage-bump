'use strict';

angular.module('eklabs.angularStarterPack.formEditor')
    .directive('demoFormEditor', ['$log', function ($log) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/form-editor/directives/editor/view.html',
            scope       : {
                 user    : '=',
            },
            link: function (scope) {
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







        function afficheBump(user){

            var articles  = [
                {
                    "title":"Prenoms", 
                    "url":"http://www.ma-grossesse-a-paris.com/wp-content/uploads/2014/12/prenoms_nuage.jpg",
                    "tag":"vie",
                    "date":"31/01/2016",
                    "choices":[
                        {
                            "choice":"oscar",
                            "bumpsTotal":"4",
                            "bumps":[
                                {"idUser":"8"},
                                {"idUser":"2"},
                                {"idUser":"4"},
                                {"idUser":"1"}
                            ]
                        },
                        {
                            "choice":"anis",
                            "bumpsTotal":"2",
                            "bumps":[
                                {"idUser":"2"},
                                {"idUser":"9"}
                            ]
                        },
                        {
                            "choice":"lucas",
                            "bumpsTotal":"7",
                            "bumps":[
                                {"idUser":"9"},
                                {"idUser":"3"},
                                {"idUser":"1"},
                                {"idUser":"4"},
                                {"idUser":"13"},
                                {"idUser":"14"},
                                {"idUser":"12"}
                            ]
                        },
                        {
                            "choice":"clement",
                            "bumpsTotal":"4",
                            "bumps":[
                                {"idUser":"9"},
                                {"idUser":"13"},
                                {"idUser":"11"},
                                {"idUser":"12"}
                            ]
                        },
                        {
                            "choice":"camille",
                            "bumpsTotal":"1",
                            "bumps":[
                                {"idUser":"3"}
                            ]
                        },
                        {
                            "choice":"caroline",
                            "bumpsTotal":"6",
                            "bumps":[
                                {"idUser":"19"},
                                {"idUser":"10"},
                                {"idUser":"7"},
                                {"idUser":"2"},
                                {"idUser":"5"},
                                {"idUser":"1"}
                            ]
                        },
                        {
                            "choice":"anais",
                            "bumpsTotal":"9",
                            "bumps":[
                                {"idUser":"12"},
                                {"idUser":"11"},
                                {"idUser":"17"},
                                {"idUser":"5"},
                                {"idUser":"9"},
                                {"idUser":"6"},
                                {"idUser":"19"},
                                {"idUser":"1"},
                                {"idUser":"8"}
                            ]
                        }

                    ]

                },
                {
                    "title":"Acteurs", 
                    "url":"http://ekladata.com/x3MPqsufnMAGzjUDTqHg9rdih6s.jpg",
                    "tag":"cinema",
                    "date":"12/06/2016",
                    "choices":[
                        {
                            "choice":"Leonardo Dicaprio",
                            "bumpsTotal":"3",
                            "bumps":[
                                {"idUser":"6"},
                                {"idUser":"3"},
                                {"idUser":"2"}
                            ]
                        },
                        {
                            "choice":"Margot Robbie",
                            "bumpsTotal":"6",
                            "bumps":[
                                {"idUser":"1"},
                                {"idUser":"9"},
                                {"idUser":"2"},
                                {"idUser":"12"},
                                {"idUser":"15"},
                                {"idUser":"19"}
                            ]
                        },
                        {
                            "choice":"Will Smith",
                            "bumpsTotal":"4",
                            "bumps":[
                                {"idUser":"6"},
                                {"idUser":"3"},
                                {"idUser":"13"},
                                {"idUser":"12"}
                            ]
                        },
                        {
                            "choice":"Jared Leto",
                            "bumpsTotal":"10",
                            "bumps":[
                                {"idUser":"3"},
                                {"idUser":"1"},
                                {"idUser":"10"},
                                {"idUser":"19"},
                                {"idUser":"17"},
                                {"idUser":"14"},
                                {"idUser":"12"},
                                {"idUser":"9"},
                                {"idUser":"6"},
                                {"idUser":"8"}
                            ]
                        },
                        {
                            "choice":"Brad Pitt",
                            "bumpsTotal":"5",
                            "bumps":[
                                {"idUser":"13"},
                                {"idUser":"11"},
                                {"idUser":"10"},
                                {"idUser":"12"},
                                {"idUser":"9"}
                            ]
                        },
                        {
                            "choice":"Cameron Diaz",
                            "bumpsTotal":"6",
                            "bumps":[
                                {"idUser":"19"},
                                {"idUser":"10"},
                                {"idUser":"7"},
                                {"idUser":"2"},
                                {"idUser":"5"},
                                {"idUser":"1"}
                            ]
                        },
                        {
                            "choice":"Jean Dujardin",
                            "bumpsTotal":"8",
                            "bumps":[
                                {"idUser":"2"},
                                {"idUser":"17"},
                                {"idUser":"15"},
                                {"idUser":"19"},
                                {"idUser":"6"},
                                {"idUser":"13"},
                                {"idUser":"10"},
                                {"idUser":"8"}
                            ]
                        }

                    ]
                },
                {
                    "title":"Films", 
                    "url":"http://www.pouvoirsafrique.com/wp-content/uploads/2016/05/Film.jpg",
                    "tag":"cinema",
                    "date":"19/11/2016",
                    "choices":[
                        {
                            "choice":"Star Wars",
                            "bumpsTotal":"6",
                            "bumps":[
                                {"idUser":"6"},
                                {"idUser":"1"},
                                {"idUser":"4"},
                                {"idUser":"13"},
                                {"idUser":"16"},
                                {"idUser":"12"}
                            ]
                        },
                        {
                            "choice":"World War Z",
                            "bumpsTotal":"4",
                            "bumps":[
                                {"idUser":"10"},
                                {"idUser":"12"},
                                {"idUser":"11"},
                                {"idUser":"9"}
                            ]
                        },
                        {
                            "choice":"Batman",
                            "bumpsTotal":"7",
                            "bumps":[
                                {"idUser":"16"},
                                {"idUser":"13"},
                                {"idUser":"11"},
                                {"idUser":"10"},
                                {"idUser":"1"},
                                {"idUser":"3"},
                                {"idUser":"2"}
                            ]
                        },
                        {
                            "choice":"Zorro",
                            "bumpsTotal":"10",
                            "bumps":[
                                {"idUser":"3"},
                                {"idUser":"11"},
                                {"idUser":"10"},
                                {"idUser":"19"},
                                {"idUser":"7"},
                                {"idUser":"4"},
                                {"idUser":"12"},
                                {"idUser":"9"},
                                {"idUser":"6"},
                                {"idUser":"8"}
                            ]
                        },
                        {
                            "choice":"007",
                            "bumpsTotal":"3",
                            "bumps":[
                                {"idUser":"3"},
                                {"idUser":"10"},
                                {"idUser":"9"}
                            ]
                        },
                        {
                            "choice":"The Social Network",
                            "bumpsTotal":"8",
                            "bumps":[
                                {"idUser":"9"},
                                {"idUser":"1"},
                                {"idUser":"7"},
                                {"idUser":"11"},
                                {"idUser":"12"},
                                {"idUser":"5"},
                                {"idUser":"2"}
                            ]
                        },
                        {
                            "choice":"Pulp Fiction",
                            "bumpsTotal":"5",
                            "bumps":[
                                {"idUser":"2"},
                                {"idUser":"1"},
                                {"idUser":"3"},
                                {"idUser":"10"},
                                {"idUser":"18"}
                            ]
                        }

                    ]
                }
                  
            ]
            var bumps;
            var choices;
            var temp = "";
            var listeArticleDuUser = new Array();
            var listeDesChoix = new Array();
            var articleExistant = new Array();
            var articleExistDeja = false;
            for(var i = 0 ; i < articles.length ; i++){
                choices = articles[i].choices;
                for(var j = 0 ; j < choices.length; j++){
                    bumps = choices[j].bumps;
                    for(var h = 0 ; h < bumps.length; h++){
                        if(user.user_id == bumps[h].idUser){
                            articleExistDeja = false;
                            for(var e = 0 ; e < articleExistant.length; e++){
                                if(articleExistant[e] == articles[i]){
                                    articleExistDeja = true;
                                }
                            }
                            if(articleExistDeja){
                                listeArticleDuUser.push(choices[j]);
                            }else{
                                listeArticleDuUser.push(articles[i] , choices[j]);
                                articleExistant.push(articles[i]);
                            }   
                            // listeDesChoix.push(choices[j]);
                            // listeDesChoix[j].push({"article" : articles[i].title } )
                        }
                    }
                }
            }
            scope.listeArticleDuUser = listeArticleDuUser;
            scope.listeDesChoix = listeDesChoix;
            console.log(scope.listeArticleDuUser);
        }
    }
}
}]);