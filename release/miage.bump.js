/**
 * MIAGE Bump
 * @version v0.3.1
 * @link 
 */

'use strict';

angular.module('miage.bump', [
    'miage.bump.button',
    'miage.bump.profile',
    'eklabs.angularStarterPack.user',
    'ngMaterial'
]).config(function ($mdIconProvider) {
    $mdIconProvider.iconSet('material-design', '/public/material-design.svg', 24);
});
'use strict';

angular.module('miage.bump.button', []);
'use strict';

angular.module('miage.bump.profile', []);
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
                        var foundTags;

                        if (tags !== undefined) {
                            foundTags = tags;
                        } else if (container !== undefined) {
                            foundTags = computeTagsFromDOM(container);
                        } else if (url !== undefined) {
                            foundTags = computeTagsFromURL(url);
                        } else {
                            foundTags = [];
                        }

                        scope.showDialog(foundTags, url);
                    }
                };

                scope.$watch('callback', function (callback) {
                    if (callback instanceof Object) {
                        scope.actions = angular.extend({}, defaultActions, callback);
                    } else {
                        scope.actions = defaultActions;
                    }
                });

                scope.showDialog = function(tags, url) {
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
                            tags: tags,
                            url : url
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
                            var bump = new Bump({
                                idUser  : scope.user.id,
                                url     : url,
                                tag     : tags.slice(1, tags.length)
                            });
                            $log.info('[Button Directive] Inserting following bump in remote database: ', bump);

                            bump.create().then(function (response) {
                                console.log(response);
                                $log.info('[Button Directive] Insertion succeeded');
                            }, function (error) {
                                console.log(error);
                                $log.error('[Button Directive] Insertion failed, got: ', error)
                            });

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
                };

                function computeTagsFromURL(url) {
                    var defer = $q.defer();

                    $http.get(url).then(function (response) {
                        var parser      = new DOMParser(),
                            document    = parser.parseFromString(response.data, 'text/html');

                        defer.resolve(computeTagsFromDOM(document));
                    }, function (error) {
                        defer.reject(error);
                    });
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
                        if (contentsMap[content].lastIndexOf('http', 0) === 0) {
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

                    list.title = element.querySelector('title').innerHTML;
                    list.language = element.documentElement.lang;

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

                    while (element.querySelector('h' + level) === null) {
                        level++;
                    }

                    list.hN         = mapFunction(element.querySelectorAll('h' + level), mapCallback).join(' ');
                    list.hNminus1   = mapFunction(element.querySelectorAll('h' + ++level), mapCallback).join(' ');
                    list.hNminus2   = mapFunction(element.querySelectorAll('h' + ++level), mapCallback).join(' ');

                    return list;
                }

                /*
                 Create bump using previously captured and processed data, then return it
                 */
                function makeBump() {
                    // Object containing the necessary bump data after page analysis
                    var bump = {};
                    bump.img = pageImage;
                    bump.url = pageUrl;
                    bump.tags = pageTags;
                    //bump.siteName = siteName;
                    //bump.pageTitle = pageTitle;
                    //bump.pageLanguage = pageLanguage;
                    //bump.occurencesCount = occurrencesArray;
                    return bump;
                }
            }
        }
    });
'use strict';

angular.module('miage.bump.button')
    .directive('bumpDialog', function ($log) {
        return {
            templateUrl : 'miage.bump/modules/button/directives/dialog/view.html',
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
                    onValidate: function (user) {
                        $log.info('User is ', user)
                    }
                };

                scope.$watch('callback', function (callback) {
                    if (callback instanceof Object) {
                        scope.actions = angular.extend({}, defaultActions, callback);
                    } else {
                        scope.actions = defaultActions;
                    }
                });
            }
        }
    });
'use strict';

angular.module('miage.bump.button')
    .directive('bumpFrame', function ($log) {
        return {
            templateUrl : 'miage.bump/modules/button/directives/frame/view.html',
            scope       : {
                user        : '=?',
                url         : '=',
                container   : '=?',
                tags        : '=?',
                callback    : '=?'
            },
            link: function (scope, element) {
                //Needed as the ng-onload event only fires once in the iframe lifetime
                element.find('iframe').on('load', function () {
                    scope.isLoading = false;
                    scope.$apply();
                });

                var urlInput = element.find('#input-url');

                scope.$watch('user', function (user) {
                    scope.myUser = user;
                });
                scope.$watch('url', function (url) {
                    scope.myUrl = typeof url === 'string' && url.length > 0 ? url : 'about:blank';
                    scope.isLoading = true;

                    urlInput.prop('value', url);
                    urlInput.triggerHandler('focus');
                    urlInput.triggerHandler('blur');
                });
                scope.$watch('container', function (container) {
                    scope.myContainer = container;
                });
                scope.$watch('tags', function (tags) {
                    scope.myTags = tags;
                });

                scope.setUser = function (e) {

                };

                scope.setUrl = function (e) {
                    if (e.keyCode !== 13) {
                        return;
                    }
                    var url = e.target.value;

                    if (url === scope.myUrl) {
                        return;
                    }
                    scope.isLoading = true;
                    scope.myUrl = url;
                };

                var defaultActions = {
                    onLoad: function (url) { //Only called once per iframe lifetime
                        $log.info('Loaded url: ', url);
                        scope.isLoading = false;
                        scope.$apply();
                    }
                };

                scope.actions = defaultActions;

                scope.$watch('callback', function (callback) {
                    if (callback instanceof Object) {
                        scope.actions = angular.extend({}, defaultActions, callback);
                    } else {
                        scope.actions = defaultActions;
                    }
                });
            }
        }
    });
'use strict';

angular.module('miage.bump.profile')
    .directive('bumpMatches', function ($log) {
        return {
            require: '^^bumpProfile',
            templateUrl: 'miage.bump/modules/profile/directives/matches/view.html',
            scope: {
                user        : '=',
                userMatches : '=?'
            },
            link: function (scope, element, attrs, profileCtrl) {
                //Watching the scope properties together opens for some decreasing in the number of calls made
                //as fetching from the parent directive is not always needed
                scope.$watchGroup(['user', 'userMatches'], function (newValues) {
                    var user        = newValues[0],
                        userMatches = newValues[1];
                    //If isolated scope was empty and both values are set (injection)
                    if (scope.myUser === undefined && scope.myMatches === undefined
                        && (user !== undefined && userMatches !== undefined)) {
                        scope.myUser    = user;
                        scope.myMatches = userMatches;

                        return;
                    }
                    //Update matches
                    scope.myMatches = userMatches;
                    //If user is the same, whether it be another digest cycle or a programmatic gimmick
                    if (user === scope.myUser) {
                        return;
                    }
                    scope.myUser    = user;
                    //If there is no user set
                    if (user === undefined) {
                        return;
                    }
                    //Else fetch bumps from parent directive
                    profileCtrl.getMatchingProfiles();
                });
            }
        }
    });

'use strict';

angular.module('miage.bump.profile')
    .directive('bumpProfile', function ($log, Bumps, User, Users, $q) {
        return {
            templateUrl: 'miage.bump/modules/profile/directives/profile/view.html',
            scope: {
                user: '='
            },
            controller: function ($scope, $state) {
                const PARENT_STATE = 'bumpProfile';
                //Some variables are controller properties since children directives need to access them
                this.bumps          = new Bumps();
                this.users          = new Users();
                this.userBumps      = [];
                this.relatedTags    = [];
                this.userTagCount   = 0;

                $scope.selectedNav  = 'tops';
                $scope.isLoading    = true;

                $q.all(this.bumps.fetch(), this.users.fetch()).then(function () {
                    $state.go(PARENT_STATE + '.' + $scope.selectedNav);
                    $scope.isLoading = false;
                });

                //Scope properties are still needed to update children directives scopes
                $scope.$watch('user', function (user) {
                    this.myUser         = user;
                    $scope.myUser       = user;
                }.bind(this));

                $scope.$watch('userTags', function (userTags) {
                    this.userTags       = userTags;
                }.bind(this));

                $scope.$watch('trendingTags', function (trendingTags) {
                    this.trendingTags   = trendingTags;
                }.bind(this));

                $scope.$watch('userMatches', function (userMatches) {
                    this.userMatches    = userMatches;
                }.bind(this));

                this.getRelatedTags = function (tag) {
                    //Filter unrelated bumps out
                    this.relatedTags = this.userBumps.filter(function (bump) {
                        return bump.tags.indexOf(tag) !== -1;
                    //Flatten nested tags within bumps
                    }).reduce(function (acc, curr) {
                        return acc.concat(curr.tags);
                    //Exclude self
                    }, []).filter(function (sibling) {
                        return sibling !== tag;
                    //Count each tag occurrences
                    }).reduce(function (acc, curr) {
                        acc[curr] = (acc[curr] || 0) + 1;

                        return acc;
                    }, {});

                    $log.info('[Profile Controller] Related tags: ', this.relatedTags);
                };

                this.getBumps = function () {
                    this.userBumps  = this.bumps.filterByUser($scope.myUser.id);
                    this.userTagCount = 0;
                    //Flatten nested tags within bumps
                    $scope.userTags = this.userBumps.reduce(function (acc, curr) {
                        return acc.concat(curr.tags);
                    //Count each tag occurrences
                    }, []).reduce(function (acc, curr) {
                        acc[curr] = (acc[curr] || 0) + 1;
                        //Increment total tag count for user
                        this.userTagCount++;

                        return acc;
                    }.bind(this), {});

                    $log.info('[Profile Controller] Tag list: ', $scope.userTags);
                    $log.info('[Profile Controller] Tag count: ', this.userTagCount);
                };

                this.getFriendsBumps = function () {
                    var friendsBumps    = this.bumps.filterByUsers($scope.myUser.friends);
                    //Flatten nested tags within bumps
                    $scope.trendingTags = friendsBumps.reduce(function (acc, curr) {
                        return acc.concat(curr.tags);
                    //Count each tag occurrences
                    }, []).reduce(function (acc, curr) {
                        acc[curr] = (acc[curr] || 0) + 1;

                        return acc;
                    }, {});

                    $log.info('[Profile Controller] Trending tags: ', $scope.trendingTags);
                };

                this.getMatchingProfiles = function () {
                    if (this.userTagCount === 0) {
                        if (this.bumps.filterByUser($scope.myUser.id).length === 0) {
                            $log.info('[Profile Controller] User has no bumps yet');

                            return;
                        }
                        this.getBumps();
                    }
                    var userMatches     = {},
                        userPromises    = [],
                        excludedUsers   = $scope.myUser.friends.concat([$scope.myUser.id]),
                        strangersBumps  = this.bumps.filterByUsers(excludedUsers, true);
                    //Flatten and merge tags for each user
                    var strangersTags   = strangersBumps.reduce(function (acc, curr) {
                        acc[curr.userId] = (acc[curr.userId] || []).concat(curr.tags);

                        return acc;
                    }, {});
                    //Compute match for each stranger
                    angular.forEach(Object.keys(strangersTags), function (strangerId) {
                        var softMatch           = 0,
                            deepMatch           = 0,
                            strangerTagCount    = 0,
                            tagRatio,
                            deepRatio;
                        //Indexed count for each tag
                        var tagsCounts = strangersTags[strangerId].reduce(function (acc, curr) {
                            acc[curr] = (acc[curr] || 0) + 1;
                            //Increment tag count for stranger
                            strangerTagCount++;

                            return acc;
                        }, {});
                        //Increase match for every matching tag
                        angular.forEach(tagsCounts, function (count, tag) {
                            if (tag in $scope.userTags) {
                                //A shared tag increases the match
                                softMatch  += 1 / Object.keys(tagsCounts).length;

                                tagRatio    = (count / strangerTagCount);
                                deepRatio   = (count / strangerTagCount) / ($scope.userTags[tag] / this.userTagCount);
                                //The closer the tag fits amongst the others, deeper the match is
                                deepMatch  += tagRatio *= deepRatio < 1 ? deepRatio : 1 / deepRatio;
                            }
                        }.bind(this));
                        //Each stranger match is 50% soft 50% deep
                        userMatches[strangerId] = softMatch * 0.5 + deepMatch * 0.5;
                        //Request info for stranger
                        //userPromises.push(new User().get(strangerId));
                    }.bind(this));
                    //Populate matches from requests and update scope
                    $q.all(userPromises).then(function (results) {
                        $scope.userMatches = Object.keys(userMatches).map(function (strangerId) {
                            //Get User resource and add its match level
                            return angular.merge({
                                match: userMatches[strangerId]
                            }, this.findUser(strangerId));
                        }.bind(this));

                        $log.info('[Profile Controller] User matches: ', $scope.userMatches);
                    }.bind(this));
                };

                //Find User within the whole collection instead of firing a new request for each matching user
                this.findUser = function (userId) {
                    return this.users.items.find(function (user) {
                        return user.id === userId;
                    });
                };
            }
        }
    });

'use strict';

angular.module('miage.bump.profile')
    .directive('bumpTops', function ($log) {
        return {
            require: '^^bumpProfile',
            templateUrl: 'miage.bump/modules/profile/directives/tops/view.html',
            scope: {
                user    : '=',
                userTags: '=?'
            },
            link: function (scope, element, attrs, profileCtrl) {
                scope.selectedTag   = null;
                scope.relatedTags   = [];

                //Watching the scope properties together opens for some decreasing in the number of calls made
                //as fetching from the parent directive is not always needed
                scope.$watchGroup(['user', 'userTags'], function (newValues) {
                    var user        = newValues[0],
                        userTags    = newValues[1];
                    //If isolated scope was empty and both values are set (injection)
                    if (scope.myUser === undefined && scope.myTags === undefined
                    && (user !== undefined && userTags !== undefined)) {
                        scope.myUser = user;
                        scope.myTags = userTags;

                        return;
                    }
                    //Update tags
                    scope.myTags = userTags;
                    //If user is the same, whether it be another digest cycle or a programmatic gimmick
                    if (user === scope.myUser) {
                        return;
                    }
                    scope.myUser = user;
                    //If there is no user set
                    if (user === undefined) {
                        return;
                    }
                    //Else fetch bumps from parent directive
                    profileCtrl.getBumps();
                });

                scope.getRelatedTags = function (tag) {
                    profileCtrl.getRelatedTags(tag);
                    scope.relatedTags = profileCtrl.relatedTags;
                    scope.selectedTag = tag;
                };
            }
        }
    });

'use strict';

angular.module('miage.bump.profile')
    .directive('bumpTrends', function ($log) {
        return {
            require: '^^bumpProfile',
            templateUrl: 'miage.bump/modules/profile/directives/trends/view.html',
            scope: {
                user        : '=',
                trendingTags: '=?'
            },
            link: function (scope, element, attrs, profileCtrl) {
                scope.maxCount = 0;
                //Watching the scope properties together opens for some decreasing in the number of calls made
                //as fetching from the parent directive is not always needed
                scope.$watchGroup(['user', 'trendingTags'], function (newValues) {
                    var user            = newValues[0],
                        trendingTags    = newValues[1];
                    //If isolated scope was empty and both values are set (injection)
                    if (scope.myUser === undefined && scope.myTrends === undefined
                    && (user !== undefined && trendingTags !== undefined)) {
                        scope.myUser    = user;
                        scope.myTrends  = trendingTags;

                        return;
                    }
                    //Update tags
                    scope.myTrends      = trendingTags;
                    //Update tag count
                    if (typeof trendingTags === 'object') {
                        scope.maxCount = Object.keys(trendingTags).reduce(function (acc, curr) {
                           return acc > trendingTags[curr] ? acc : trendingTags[curr];
                        }, 0);
                    }
                    $log.info(scope.maxCount);
                    //If user is the same, whether it be another digest cycle or a programmatic gimmick
                    if (user === scope.myUser) {
                        return;
                    }
                    scope.myUser        = user;
                    //If there is no user set
                    if (user === undefined) {
                        return;
                    }
                    //Else fetch bumps from parent directive
                    profileCtrl.getFriendsBumps();
                });
            }
        }
    });

'use strict';

angular.module('miage.bump.config', [])
    .factory('$config', function (WEBAPP_CONFIG) {
        var parameters = angular.extend({}, WEBAPP_CONFIG);

        return {
            get: function (name) {
                return parameters[name];
            }
        }
    });
'use strict';

angular.module('miage.bump')
    .factory('Bump', function ($config, $http, $q) {

        var route = $config.get('api') + '/bump/';

        /**
         * @typedef {Object} Bump
         * @property {string} id
         * @property {string} userId
         * @property {string} img
         * @property {string} url
         * @property {Array.<string>} tags
         */

        /**
         * Constructor
         * @param {Object} data
         * @param {string=} data.id
         * @param {string=} data.idUser
         * @param {string=} data.img
         * @param {string=} data.url
         * @param {Array.<string>=} data.tag
         * @constructor
         */
        var Bump = function (data) {
            if (typeof data === 'object') {
                this.id     = data.id;
                this.userId = data.idUser;
                this.img    = data.img;
                this.url    = data.url;
                this.tags   = data.tag;
            } else {
                throw new TypeError('The following Bump is malformed: ' + angular.toJson(data));
            }
        };

        Bump.prototype = Object.create({});
        Bump.prototype.constructor = Bump;

        /**
         * Access to id attribute
         * @returns {string}
         */
        Bump.prototype.getId = function () {
            return this.id;
        };

        /**
         * @returns {string}
         */
        Bump.prototype.getUserId = function () {
            return this.userId;
        };

        /**
         * @returns {string}
         */
        Bump.prototype.getImg = function () {
            return this.img;
        };

        /**
         * @returns {string}
         */
        Bump.prototype.getUrl = function () {
            return this.url;
        };

        /**
         * @returns {Array.<string>}
         */
        Bump.prototype.getTags = function () {
            return this.tags;
        };

        /**
         * Manage case no photo ;)
         * @returns {string}
         */
        Bump.prototype.getPicture = function () {
            //TODO: upload a default image
            return (this.photo) ? this.photo : 'http://91.134.241.60:8020/images/mbs.core/icons/bump.png'
        };

        /**
         * Transform Object Bump to JSON for an API
         * @returns {{idUser: string, img: string, url: string, tag: Array.<string>}}
         */
        Bump.prototype.toApi = function () {
            return {
                idUser  : this.userId,
                img     : this.img,
                url     : this.url,
                tag     : this.tags
            }
        };

        /**
         * Method to retrieve bump information
         * @param {string} id
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bump.prototype.get = function (id) {
            var defer       = $q.defer(),
                accessRoute = route + (id ? id : (this.id) ? this.id : undefined);

            $http.get(accessRoute).then(function (response) {
                defer.resolve(new Bump(response.data));
            },function (reason) {
                defer.reject(reason)
            });

            return defer.promise;
        };

        /**
         * Method to create a new bump
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bump.prototype.create = function () {
            var defer   = $q.defer();

            $http.post(route, this.toApi()).then(function (response) {
                this.id = response.data.id;
                defer.resolve(this);
            }.bind(this), function(reason){
                defer.reject(reason)
            });

            return defer.promise;

        };

        /**
         * Delete
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bump.prototype.delete = function () {
            return $http.delete(route+this.getId());
        };

        /**
         * Update the current bump
         * @param {Object} data
         * @param {string=} data.userId
         * @param {string=} data.img
         * @param {string=} data.url
         * @param {Array.<string>=} data.tags
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bump.prototype.update = function (data) {
            return $http.put(route + this.getId(), data);
        };

        /**
         * Make a copy of the current item 
         * @returns {Bump}
         */
        Bump.prototype.clone = function(){
            return new Bump(this);
        };

        return Bump;
    });
'use strict';

angular.module('miage.bump')
    .factory('Bumps', function ($log, $config, $http, $q, Bump) {

        var route = $config.get('api') + '/bump/';

        var Bumps  = function (data) {
            this.ids    = [];
            this.items  = [];

            if (typeof data === 'object') {
                this.addItems(data);
            }
        };

        Bumps.prototype = Object.create({});
        Bumps.prototype.constructor = Bumps;

        /**
         * Find all Bumps from the database
         * @returns {jQuery.promise|promise.promise|Function|Promise}
         */
        Bumps.prototype.fetch = function () {
            return $http.get(route).then(function (response) {
                this.addItems(response.data);
            }.bind(this));
        };

        /**
         * Filter bumps from a specific user
         * @param {string} userId
         * @returns {Array.<Bump>}
         */
        Bumps.prototype.filterByUser = function (userId) {
            return this.items.filter(function (bump) {
                return bump.userId === userId;
            });
        };

        /**
         * Filter bumps from a specifc user's friends
         * @param {Array.<string>} usersIds
         * @param {boolean=} exclude
         * @returns {Array.<Bump>}
         */
        Bumps.prototype.filterByUsers = function (usersIds, exclude) {
            if (exclude === true) {
                return this.items.filter(function (bump) {
                    return usersIds.indexOf(bump.userId) === -1;
                });
            }
            return this.items.filter(function (bump) {
                return usersIds.indexOf(bump.userId) !== -1;
            });
        };

        /**
         * Add bumps to our list
         * @param {Array.<Bump>} items
         */
        Bumps.prototype.addItems = function (items) {
            if (Array.isArray(items)) {
                angular.forEach(items, function (item) {
                    this.addItem(item);
                }.bind(this));
            } else {
                this.addItem(data);
            }
        };

        /**
         * Add a single bump
         * @param {Bump} item
         */
        Bumps.prototype.addItem = function (item) {
            try {
                var bump = new Bump(item);
                // --- Check if not already into our items list
                if (bump.getId() && this.ids.indexOf(bump.getId()) === -1) {
                    this.ids.push(bump.getId());
                    this.items.push(bump);
                }
            } catch (e) {
                $log.warn(e.message);
            }
        };

        /**
         * Check the data from the list
         * @returns {boolean}
         */
        Bumps.prototype.isEmpty = function () {
            return this.ids.length == 0
        };

        // ------- RETURN THE OBJECT
        return Bumps;
    });
'use strict';

/**
 * Crossdomain resources trusting
 */
angular.module('miage.bump')
    .filter('trusted', function ($sce) {
        return function (url) {
            return $sce.trustAsResourceUrl(url);
        }
    });