angular.module('angular-i18n', ['ng'])
	//  create our localization service
    .provider('$i18n', [ function () {
        var pathLanguageRegex = /\|LANG\|/,
            pathLanguageURL = '/i18n/|LANG|.json',
            defaultLanguage = 'en-US',
            language = null,
            fallback = null;

        this.setPathLanguageRegex = function (regex) {
            pathLanguageRegex = regex;
            return this;
        };

        this.setPathLanguageURL = function (templateUrl) {
            pathLanguageURL = templateUrl;
            return this;
        };

        this.setDefaultLanguage = function (defaultLang) {
            defaultLanguage = defaultLang;
            return this;
        };

        this.setLanguage = function (lang) {
            language = lang;
            return this;
        };

        this.setFallback = function(object) {
            fallback = object;
            return this;
        };

        this.$get = ['$http', '$rootScope', '$window', '$q', '$timeout', function ($http, $rootScope, $window, $q, $timeout) {
            return new Localize($http, $rootScope, $window, $q, $timeout)
        }];

        function Localize($http, $rootScope, $window, $q, $timeout) {
            //  array to hold the localized resource string entries
            var dictionary = {};
            var promises = {};

            var translateInternal = function(value, lang)
            {
                var placeholders = [];
                var translated;

                if( !dictionary || !dictionary[lang] || !dictionary[lang].loaded )
                {
                    if( typeof fallback === "object" && fallback[value])
                    {
                        translated = fallback[value];
                    }
                }
                else
                {
                    translated = dictionary[lang].translation[value];
                }

                for (var i = 2; i < arguments.length; i++) {
                    placeholders.push(arguments[i]);
                }
                if (translated === null)
                {
                    translated = sprintf(value, placeholders);
                }
                else
                {
                    translated = sprintf(translated, placeholders);
                }

                return translated;
            };

            //  use the $window service to get the language of the user's browser
            this.getCurrentLanguage = function () {
                return language || $window.navigator.userLanguage || $window.navigator.language || defaultLanguage;
            };

            //  loading translation file for current language succceed
            this.loadTranslationFileSucceed = function (data, lang) {
                //  store the returned array in the dictionary
                dictionary[lang].translation = data;
                dictionary[lang].loading = false;
                dictionary[lang].loaded = true;

                //  loop into any promises yet to be resolved for this language
                for (var promiseObject in promises[lang])
                {
                    if (promises[lang].hasOwnProperty(promiseObject)) {
                        promises[lang][promiseObject].deferrer.resolve(translateInternal.apply(this, promises[lang][promiseObject].arguments));
                        delete promises[lang][promiseObject];
                    }
                }

                //  broadcast that the file has been loaded
                $rootScope.$broadcast('i18nUpdated');
            };

            this.loadTranslationFile = function (lang) {
                if( dictionary[lang] && (dictionary[lang].loading === true || dictionary[lang].loaded === true) )
                {
                    return;
                }

                var url = pathLanguageURL.replace(pathLanguageRegex, lang.replace('-', '_')),
                    self = this;

                //  create the translation object
                dictionary[lang] = {
                    loading     : true,
                    loaded      : false,
                    translation : null
                };

                //  we will store the promise here.
                promises[lang] = {};

                //  request the resource file
                $timeout(function() {
                    $http({ method:"GET", url:url, cache:false })
                        .success(function(data, status, headers, config) {
                            self.loadTranslationFileSucceed(data, lang)
                        })
                        .error(function () {
                            //  the request failed set the url to the english resource file
                            var url2 = pathLanguageURL.replace(pathLanguageRegex, defaultLanguage.replace('-', '_'));
                            //  request the default resource file
                            $http({ method:"GET", url:url2, cache:false })
                                .success(function(data, status, headers, config) {
                                    self.loadTranslationFileSucceed(data, lang)
                                })
                                .error(function() {deferrer.reject("Could not load translation files "+ url +" or "+ url2)});
                        }
                    );
                },
                4000);

            };

            this.getTranslation = function(value)
            {
                var args = Array.prototype.slice.call(arguments);
                args.splice(1, 0, this.getCurrentLanguage());
                return translateInternal.apply(this, args);
            };

            this.translate = function (value)
            {
                /*                // Support changing of language
                 if($rootScope.appconfig.user.lang && localize.language != $rootScope.appconfig.user.lang){
                 localize.language = $rootScope.appconfig.user.lang;
                 localize.resourceFileLoaded = false;
                 }*/

                //  define the language used when translation was called
                var lang = this.getCurrentLanguage(),
                    deferrer = null,
                    args = Array.prototype.slice.call(arguments);

                // add the language to the argument array
                args.splice(1, 0, lang);

                var addPromise = function(args, instant) {

                    instant = typeof instant !== 'undefined' ? instant : false;

                    var deferrer = null,
                        promise  = null;

                    //  a promise exists for this value for this language returns it
                    if( promises[lang] && promises[lang][value] )
                    {
                        return promises[lang][value].deferrer;
                    }
                    //  no promise exists for this value, create it
                    else
                    {
                        deferrer = $q.defer();
                        promise = deferrer.promise;
                        promise.success = function (fn)
                        {
                            promise.then(fn);
                            return promise;
                        };
                        promise.error = function (fn)
                        {
                            promise.then(null, fn);
                            return promise;
                        };

                        if (!instant)
                        {
                            promises[lang][value] = {arguments: args, deferrer: deferrer};
                        }
                        return deferrer;
                    }
                };

                //  we haven't load the file yet
                if( !dictionary[lang] || (!dictionary[lang].loading && !dictionary[lang].loaded) )
                {
                    this.loadTranslationFile(lang);
                }

                //  we have called the loading process but we are still waiting on the file
                if( !dictionary[lang] || (!dictionary[lang].loading && !dictionary[lang].loaded)
                    || (dictionary[lang] && dictionary[lang].loading) )
                {
                    //deferrer = addPromise(args);
                    //deferrer.reject();
                    return addPromise(args).promise;
                }

                //  make sure the dictionary has valid data
                if (dictionary[lang]
                    && !dictionary[lang].loading
                    && dictionary[lang].loaded
                    && typeof dictionary[lang].translation === "object") {
                    deferrer = addPromise(args, true);
                    deferrer.resolve(translateInternal.apply(this, args));
                    return deferrer.promise;
                }
            }
        }
    }])

    .filter('i18n', ['$i18n', function ($i18n) {
        var currentLanguage = null;
        var myFilter = function(input) {
            var translation = $i18n.getTranslation.apply($i18n, arguments);
            if( currentLanguage === null || currentLanguage !== $i18n.getCurrentLanguage() )
            {
                currentLanguage = $i18n.getCurrentLanguage();
                $i18n.loadTranslationFile(currentLanguage);
            }
            return translation;
        };
        myFilter.$stateful = true;
        return myFilter;
    }])

    .directive('i18n', ['$i18n', function ($i18n) {
        return {
            restrict: "A",
            link: function (scope, elm, attrs) {
                //  construct the tag to insert into the element
                var tag = $i18n.getTranslation(attrs.i18n);
                elm.text(tag);

                $i18n.translate(attrs.i18n)
                    .success(function(translated) {
                        elm.text(translated)
                    });
            }
        }
    }]);
