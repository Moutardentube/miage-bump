'use strict';

angular.module('eklabs.angularStarterPack.bump')
    .directive('bumpButton', ['$log', '$mdDialog', function ($log, $mdDialog) {
        return {
            templateUrl : 'eklabs.angularStarterPack/modules/bump/directives/button/view.html',
            scope       : {
                user        : '=',
                url         : '=?',
                tags        : '=?',
                callback    : '=?'
            },
            link: function (scope) {
                scope.$watch('user', function (user) {
                    scope.myUser = user;
                });
                scope.$watch('url', function (url) {
                    scope.myUrl = url;
                });

                var defaultActions = {
                    onBump: function (user, url, e) {
                        //TODO: generate tags from url contents and add them to user
                        scope.tags = ['Tag 1', 'Tag 2', 'Tag 3'];
                        scope.showDialog(e);
                    }
                };

                scope.$watch('callback', function (callback) {
                    if (callback instanceof Object) {
                        scope.actions = angular.extend({}, defaultActions, callback);
                    } else {
                        scope.actions = defaultActions;
                    }
                });

                scope.showDialog = function() {
                    $mdDialog.show({
                        template:
                        '<md-dialog aria-label="Bump?">' +
                        '   <md-dialog-content>' +
                        '       <md-list layout="column" layout-padding>' +
                        '           <md-list-item layout="row" layout-align="space-between center">' +
                        '                <md-input-container>' +
                        '                    <input placeholder="Renseignez un tag"' +
                        '                           ng-model="tags[0]" />' +
                        '                </md-input-container>' +
                        '                <md-button ng-click="addTag(tags[0])">' +
                        '                    <md-icon md-svg-src="material-design:add"></md-icon>' +
                        '                </md-button>' +
                        '           </md-list-item>' +
                        '           <md-list-item layout="row" layout-align="space-between center"' +
                        '                         ng-repeat="tag in tags" ng-if="$index > 0">' +
                        '                <md-input-container>' +
                        '                    <input ng-model="tag" />' +
                        '                </md-input-container>' +
                        '                <md-button ng-click="deleteTag($index)">' +
                        '                    <md-icon md-svg-src="material-design:delete"></md-icon>' +
                        '                </md-button>' +
                        '           </md-list-item>' +
                        '       </md-list>' +
                        '   </md-dialog-content>' +
                        '   <md-dialog-actions>' +
                        '       <md-button ng-click="closeDialog()">Cancel</md-button>' +
                        '       <md-button ng-click="confirmBump()">Bump!</md-button>' +
                        '   </md-dialog-actions>' +
                        '</md-dialog>',
                        locals: {
                            tags: scope.tags,
                            url : scope.myUrl
                        },
                        controller: DialogController
                    });
                    function DialogController($scope, $mdDialog, tags, url) {
                        tags.unshift('');
                        $scope.tags = tags;

                        $scope.closeDialog = function() {
                            $mdDialog.hide();
                        };
                        $scope.confirmBump = function() {
                            //TODO: save tags and url for user

                            /**
                             * Created by Clément on 06/12/2016.
                             */
                            var siteName = "";
                            var pageTitle = "";
                            var pageKeywords = "";
                            var pageDescription = "";
                            var pageLanguage = "";
                            var pageUrl = "";
                            var pageImage = "";

                            var pageH1Array = [];
                            var pageH2Array = [];
                            var pageH3Array = [];

                            // Contains all h1 words to be later used as tags
                            var pageH1CleanedArray = [];

                            var descriptionArray = [];

                            var pageTags = [];

                            var pageParagraphs = "";

                            var occurrencesArray = [];

                            /*
                             Regexp used to filter/search through and clean data
                             */
                            var regexpSiteName = new RegExp(/site|name/, 'ig');
                            var regexpKeywords = new RegExp(/keyword/, 'ig');
                            var regexpDescription = new RegExp(/description/, 'ig');
                            var regexpLanguage = new RegExp(/language/, 'ig');
                            var regexpUrl = new RegExp(/url/, 'ig');
                            var regexpImage = new RegExp(/image/, 'ig');
                            var regexCleaner = new RegExp(/ le | la | les | l'| l’| de | du | des | d'| d’| mais | ou | et | donc | or | ni | car | que | qu'| si | lorsque | comme | puisque | quand | dans | à | a | chez | en | dans | avant | devant | après | derrière | par | pour | avec | entre | jusque | jusqu' | contre | sur | sous | vers | sans | envers | près | auprès | autour |[.,\/#!$%\^&\*;:{}=\-_`~()«»"]/, 'ig');
                            var regexWhitespace = new RegExp(/\s{2,}/, 'g');

                            /*
                             Get the content of the main metas tags (name, languauge, keywords, image,...
                             */
                            function getMetasContent() {
                                var metas = document.getElementsByTagName('meta');

                                for (var i=0 ; i<metas.length ; i++) {
                                    if(metas[i].getAttribute("name")) {
                                        if (siteName=="" && metas[i].getAttribute("name").search(regexpSiteName)!= -1) {
                                            siteName = metas[i].getAttribute("content");
                                        }
                                        if (pageKeywords=="" && metas[i].getAttribute("name").search(regexpKeywords)!= -1 ) {
                                            pageKeywords = metas[i].getAttribute("content");
                                        }
                                        if (pageDescription=="" && metas[i].getAttribute("name").search(regexpDescription)!= -1) {
                                            pageDescription = " " + metas[i].getAttribute("content");
                                            pageDescription = pageDescription.replace(regexCleaner," ");
                                            pageDescription = pageDescription.replace(regexCleaner," ");
                                            pageDescription = pageDescription.replace(regexWhitespace, " ");
                                        }
                                        if (pageLanguage=="" && metas[i].getAttribute("name").search(regexpLanguage)!= -1) {
                                            pageLanguage = metas[i].getAttribute("content");
                                        }
                                        if (pageUrl.length<2 && metas[i].getAttribute("name").search(regexpUrl)!= -1) {
                                            pageUrl = metas[i].getAttribute("content");
                                        }
                                        if (pageImage=="" && metas[i].getAttribute("name").search(regexpImage)!= -1) {
                                            pageImage = metas[i].getAttribute("content");
                                        }
                                    }
                                }
                            }

                            /*
                             Get the pages 'basic' html elements like title or language.
                             This function is used to complement the getMetasContent() function by trying to get datas that couldn't be found in the metas.
                             */
                            function getPageBasicHTMLElement() {
                                pageTitle = document.getElementsByTagName("title")[0].innerHTML;
                                if(pageLanguage=="") {
                                    pageLanguage = document.documentElement.lang;
                                }
                            }

                            /*
                             Get the page 3 main titles (h1, h2, h3)
                             */
                            function getTitles() {
                                var h1 = document.getElementsByTagName('h1');
                                var h2 = document.getElementsByTagName('h2');
                                var h3 = document.getElementsByTagName('h3');

                                for (var i=0 ; i<h1.length ; i++) {
                                    var h1Content = h1[i].textContent;
                                    pageH1Array.push(h1Content);
                                    pageH1CleanedArray.push(h1Content.replace(regexCleaner," ").replace(regexCleaner," ").replace(regexWhitespace, " "));
                                }

                                for (var i=0 ; i<h2.length ; i++) {
                                    pageH2Array.push(h2[i].textContent);
                                }

                                for (var i=0 ; i<h3.length ; i++) {
                                    pageH3Array.push(h3[i].textContent);
                                }
                            }

                            /*
                             Extract tags from the page description and the h1 titles captured in the page.
                             */
                            function extractTags() {
                                descriptionArray = pageDescription.trim().split(" ");
                                pageTags.push.apply(pageTags, descriptionArray);
                                for(var i=0 ; i<pageH1CleanedArray.length ; i++) {
                                    var currentH1Array = pageH1CleanedArray[i].trim().split(" ");
                                    for(var j=0 ; j<currentH1Array.length ; j++) {
                                        var currentH1 = currentH1Array[j];
                                        if (currentH1 != " " && pageTags.indexOf(currentH1) == -1) {
                                            // word/tag not in tags array = need to add it to tags list
                                            pageTags.push(currentH1);
                                        }
                                    }
                                }
                            }

                            /*
                             Gather all page's paragraphs (<p></p>) into one string variabe.
                             */
                            function gatherParagraphs() {
                                var paragraphs = document.getElementsByTagName('p');

                                for (var i=0 ; i<paragraphs.length ; i++) {
                                    // innerText for IE, textContent for other browsers
                                    pageParagraphs += paragraphs[i].textContent || paragraphs[i].innerText;
                                }
                            }

                            /*
                             Count the occurences of each tag (word) in the pageTags array and store the resulting object (word,count) in the occurencesArray
                             */
                            function countOccurrences() {
                                for(var i=0 ; i<pageTags.length ; i++) {
                                    var word = pageTags[i];
                                    var regex = new RegExp(word, 'ig');
                                    var count = (pageParagraphs.match(regex) || []).length;
                                    var occurrence = {word: word, count: count};
                                    occurrencesArray.push(occurrence);
                                }
                            }

                            /*
                             Create bump using previously captured and processed data, then return it
                             */
                            function makeBump() {
                                // Object containing the necessary bump data after page analysis
                                var bump = new Object();
                                bump.img = pageImage;
                                bump.url = pageUrl;
                                bump.tags = pageTags;
                                //bump.siteName = siteName;
                                //bump.pageTitle = pageTitle;
                                //bump.pageLanguage = pageLanguage;
                                //bump.occurencesCount = occurrencesArray;
                                return bump;
                            }

                            /*
                             Debugging function based on console's logs
                             */
                            function debugAnalyser() {
                                console.log(metas[0]);

                                console.log("h1 : " + pageH1Array +
                                    "\nh2 : " + pageH2Array +
                                    "\nh3 : " + pageH3Array);

                                console.log("siteName : " + siteName +
                                    "\npageKeywords : " + pageKeywords +
                                    "\npageDescription : " + pageDescription +
                                    "\npageLanguage : " + pageLanguage +
                                    "\npageUrl : " + pageUrl +
                                    "\npageImage : " + pageImage);

                                for(var i=0 ; i<occurrencesArray.length ; i++) {
                                    console.log("The word : " + occurrencesArray[i].word + " occurs : " + occurrencesArray[i].count + " times in the text");
                                }
                            }

                            /*
                             Main function that calls all the useful functions in order to create the page bump.
                             */
                            function analysePage() {
                                getMetasContent();
                                getPageBasicHTMLElement();
                                getTitles();

                                extractTags();

                                gatherParagraphs();

                                countOccurrences();

                                var bump = makeBump();
                                return bump;

                                /*
                                 DEBUG
                                 */
                                //debugAnalyser();
                            }

                            $scope.closeDialog();
                        };
                        $scope.addTag = function (tag) {
                            if (tag === '') {
                                return;
                            }
                            $scope.tags.splice(1, 0, tag);
                            $scope.tags[0] = '';
                        };
                        $scope.editTag = function (index) {

                        };
                        $scope.deleteTag = function (index) {
                            $scope.tags.splice(index, 1);
                        };
                    }
                }
            }
        }
    }]);