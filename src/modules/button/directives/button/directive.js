'use strict';

angular.module('miage.bump.button')
    .directive('bumpButton', function ($log, $mdDialog, $http, $q, Bump) {
        return {
            templateUrl : 'miage.bump/modules/button/directives/button/view.html',
            scope       : {
                user        : '=',
                url         : '=?',
                container   : '=?',
                tags        : '=?',
                callback    : '=?'
            },
            link: function (scope) {
                const CONTENT_WEIGHTS   = {
                    description : 5,
                    hN          : 7,
                    hNminus1    : 5,
                    hNminus2    : 3,
                    keywords    : 1,
                    name        : 1,
                    site        : 1,
                    title       : 9,
                    url         : 1
                },
                    CONTENT_WEIGHT_MIN  = 15;

                var dialog = $q.defer().promise;

                scope.$watch('user', function (user) {
                    scope.myUser = user;
                });
                scope.$watch('url', function (url) {
                    scope.myUrl = url;
                });
                scope.$watch('container', function (container) {
                    scope.myContainer = container;
                });
                scope.$watch('tags', function (tags) {
                    scope.myTags = tags;
                });

                var defaultActions = {
                    onBump: function (user, url, container, tags) {
                        var foundTags = $q.defer(); //In some cases the tags are found asynchronously

                        if (tags !== undefined) {
                            foundTags.resolve(tags); //Synchronous
                        } else if (container !== undefined) {
                            foundTags.resolve(computeTagsFromDOM(container)); //Synchronous
                        } else if (url !== undefined) {
                            foundTags = computeTagsFromURL(url); //Asynchronous
                        } else {
                            foundTags.resolve([]);
                        }

                        $q.when(foundTags.promise, function (tags) { //When the tags are available
                            scope.myFoundTags = tags;
                            scope.showDialog(tags, url);
                        });
                    }
                };

                scope.$watch('callback', function (callback) {
                    if (callback instanceof Object) {
                        scope.actions = angular.extend({}, defaultActions, callback);
                    } else {
                        scope.actions = defaultActions;
                    }
                });

                scope.showDialog = function (tags, url) {
                    dialog = $mdDialog.show({
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
                            tags: tags,
                            url : url
                        },
                        controller: DialogController
                    });

                    dialog.then(function (tags) { //Success callback fired from $mdDialog
                        createBump(tags);
                    });

                    function DialogController($scope, $mdDialog, tags) {
                        tags.unshift('');
                        $scope.tags = tags;

                        $scope.closeDialog = function () {
                            $mdDialog.cancel(); //Fires error callback
                        };
                        $scope.confirmBump = function () {
                            $mdDialog.hide($scope.tags); //Fires success callback with tags as argument
                        };
                        $scope.addTag = function (tag) {
                            if (tag === '') {
                                return;
                            }
                            $scope.tags.splice(1, 0, tag);
                            $scope.tags[0] = '';
                        };
                        $scope.deleteTag = function (index) {
                            $scope.tags.splice(index, 1);
                        };
                    }
                };

                function createBump(tags) {
                    var bump = new Bump({
                        idUser  : scope.user.id,
                        url     : scope.url,
                        tag     : tags.slice(1, tags.length)
                    });
                    $log.info('[Button Directive] Inserting following bump in remote database: ', bump);

                    bump.create().then(function () {
                        $log.info('[Button Directive] Insertion succeeded');
                    }, function (error) {
                        $log.error('[Button Directive] Insertion failed, got: ', error)
                    });
                }

                function computeTagsFromURL(url) {
                    var deferred = $q.defer();

                    $http.get(url).then(function (response) {
                        var parser      = new DOMParser(),
                            document    = parser.parseFromString(response.data, 'text/html');

                        deferred.resolve(computeTagsFromDOM(document));
                    }, function (error) {
                        deferred.reject(error);
                    });

                    return deferred;
                }

                function computeTagsFromDOM(container) {
                    if (typeof container === 'string') {
                        container = document.querySelector(container);
                    }
                    if (container instanceof HTMLIFrameElement) {
                        container = container.contentDocument;
                    } else if (!Node.prototype.isPrototypeOf(container)) {
                        throw new TypeError('[Button Directive] argument container must be either a Node or a String' +
                            'instance, got: ' + Object.prototype.toString.call(container));
                    }
                    $log.info('[Button Directive] Retrieving contents from: ', container);

                    var contentsMap     = {},
                        contentsFound   = [contentsMap];

                    if (Document.prototype.isPrototypeOf(container)
                     || container.constructor.name === 'HTMLDocument') {
                        contentsFound.push(getMetasContent(container));
                        contentsFound.push(getPageBasicHTMLElement(container));
                    }
                    contentsFound.push(getTitles(container));

                    angular.merge.apply(null, contentsFound);

                    /*
                     Regexp used to filter/search through and clean data
                     */
                    var regexCleaner    = /\Wle\W|\Wla\W|\Wles\W|\Wl'|\Wl'|\Wde\W|\Wdu\W|\Wdes\W|\Wd'|\Wd'|\Wmais\W|\Wou\W|\Wet\W|\Wdonc\W|\Wor\W|\Wni\W|\Wcar\W|\Wque\W|\Wqu'|\Wsi\W|\Wlorsque\W|\Wcomme\W|\Wpuisque\W|\Wquand\W|\Wdans\W|\Wà\W|\Wa|\Wchez\W|\Wen\W|\Wdans\W|\Wavant\W|\Wdevant\W|\Waprès\W|\Wderrière\W|\Wpar\W|\Wpour\W|\Wavec\W|\Wentre\W|\Wjusque\W|\Wjusqu'|\Wcontre\W|\Wsur\W|\Wsous\W|\Wvers\W|\Wsans\W|\Wenvers\W|\Wprès\W|\Wauprès\W|\Wautour\W|\d\D|[.,\/#!$%\^&*;:{}=\-_'~()«»"@\n\t]/ig,
                        regexWhitespace = /\s{2,}/g;

                    for (var content in contentsMap) {
                        if (undefined === contentsMap[content] || contentsMap[content].lastIndexOf('http', 0) === 0) {
                            //If string starts with http, ie site url or thumbnail
                            continue;
                        }
                        contentsMap[content] = contentsMap[content]
                            .replace(regexCleaner, ' ')
                            .replace(regexWhitespace, ' ')
                            .toLowerCase();
                    }
                    $log.info('[Button Directive] Contents retrieved and filtered: ', contentsMap);

                    //Count occurrences for each word
                    var wordCounts = Object.keys(contentsMap).reduce(function(acc, curr) {
                        //Increment each word counter by the weight of its container
                        if (undefined === contentsMap[curr]) {
                            return acc;
                        }
                        angular.forEach(contentsMap[curr].split(' '), function (word) {
                            if (typeof CONTENT_WEIGHTS[curr] === 'number') {
                                acc[word] = (acc[word] || 0) + CONTENT_WEIGHTS[curr];
                            }
                        });

                        return acc;
                    }, {});

                    //Filter out the words under the threshold
                    return Object.keys(wordCounts).filter(function (word) {
                        return wordCounts[word] > CONTENT_WEIGHT_MIN;
                    //Transform into an array
                    }).reduce(function (acc, curr) {
                        acc.push(curr);

                        return acc;
                    }, []);

                    //TODO: store the thumbnail image somewhere
                }

                /*
                 Get the content of the main metas tags (name, language, keywords, image,...
                 */
                function getMetasContent(element) {
                    var list        = {},
                        patterns    = [
                            /site/i,
                            /name/i,
                            /keywords/i,
                            /description/i,
                            /language/i,
                            /url/i,
                            /image/i
                        ],
                        metas       = element.querySelectorAll('meta'),
                        i, j, k, l;

                    for (i = 0, k = metas.length; i < k && patterns.length > 0; i++) {
                        for (j = 0, l = patterns.length; j < l; j++) {
                            if (metas[i].hasAttribute('name')
                             && metas[i].getAttribute('name').search(patterns[j]) !== -1) {
                                list[patterns[j].source] = metas[i].getAttribute('content');
                                patterns.splice(j, 1); //Stop main loop if all patterns are found

                                break; //Stop this loop if the pattern is found
                            }
                        }
                    }

                    return list;
                }

                /*
                 Get the pages 'basic' html elements like title or language.
                 This function is used to complement the getMetasContent() function by trying to get datas that couldn't be found in the metas.
                 */
                function getPageBasicHTMLElement(element) {
                    var list = {};

                    list.title = (element.querySelector('title') || {}).innerHTML;
                    //list.language = element.documentElement.lang;

                    return list;
                }

                /*
                 Get the 3 main titles
                 */
                function getTitles(element) {
                    var list = {},
                        level = 1,
                        mapFunction = function () { //Function used to map over a NodeList
                            var args = Array.prototype.slice.call(arguments, 0), //Actual arguments left after shifting
                                array = args.shift(); //The array to call map upon

                            return Array.prototype.map.apply(array, args);
                        },
                        mapCallback = function (title) {
                            return title.textContent || title.innerText;
                        };

                    while (element.querySelector('h' + level) === null && level < 10) {
                        level++;
                    }

                    list.hN         = mapFunction(element.querySelectorAll('h' + level), mapCallback).join(' ');
                    list.hNminus1   = mapFunction(element.querySelectorAll('h' + ++level), mapCallback).join(' ');
                    list.hNminus2   = mapFunction(element.querySelectorAll('h' + ++level), mapCallback).join(' ');

                    return list;
                }
            }
        }
    });