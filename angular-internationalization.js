angular.module('angular-i18n', ['ng'])
    //  create our localization service
    .provider('$i18n', [function () {
        return {
            _fileURL: '/i18n/|LANG|_|PART|.json',
            _fileURLLanguageToken: /\|LANG\|/,
            _fileURLPartToken: /\|PART\|/,
            _allowPartialFileLoading: false,
            _useBaseHrefTag: false,
            _baseHref: '',
            _defaultLanguage: 'en-US',
            _language: null,
            _fallback: null,

            get allowPartialFileLoading() {
                return this._allowPartialFileLoading;
            },
            set allowPartialFileLoading(value) {
                this._allowPartialFileLoading = value;
                return this;
            },
            get baseHref() {
                return this._baseHref;
            },

            get defaultLanguage() {
                return this._defaultLanguage;
            },
            set defaultLanguage(lang) {
                this._defaultLanguage = lang;
                return this;
            },

            get fallback() {
                return this._fallback;
            },
            set fallback(json) {
                this._fallback = json;
                return this;
            },

            get fileURL() {
                return this._fileURL;
            },
            set fileURL(url) {
                this._fileURL = url;
                return this;
            },

            get fileURLLanguageToken() {
                return this._fileURLLanguageToken;
            },
            set fileURLLanguageToken(value) {
                this._fileURLLanguageToken = value;
                return this;
            },

            get fileURLPartToken() {
                return this._fileURLPartToken;
            },
            set fileURLPartToken(value) {
                this._fileURLPartToken = value;
                return this;
            },

            get language() {
                return this._language;
            },
            set language(lang) {
                this._language = lang;
                return this;
            },

            get useBaseHrefTag() {
                return this._useBaseHrefTag;
            },
            set useBaseHrefTag(value) {
                this._useBaseHrefTag = value;
                if (this._useBaseHrefTag) {
                    var bases = document.getElementsByTagName('base');
                    if (bases.length > 0) {
                        this._baseHref = bases[0].href;
                    }
                }
                else {
                    this._baseHref = '';
                }
                return this;
            },

            $get: ['$http', '$rootScope', '$window', '$q',
                function ($http, $rootScope, $window, $q) {
                    var _this = this;
                    return {
                        _dictionary: {},
                        _promises: {},

                        get language() {
                            return _this.language || $window.navigator.userLanguage
                                || $window.navigator.language || _this.defaultLanguage;
                        },
                        set language(lang) {
                            _this.language = lang;
                            return this;
                        },

                        _checkSectionParameter: function(section)
                        {
                            section = angular.isDefined(section) ? section : 'all';
                            if( !angular.isString(section) )
                            {
                                throw new Error('section parameter must be of type string');
                            }

                            if( !_this.allowPartialFileLoading && section !== 'all')
                            {
                                throw new Error('Partial loading has been disable by the provider.');
                            }
                            return section;
                        },

                        _getLanguageAndTranslate: function (value, section) {
                            var args = Array.prototype.slice.call(arguments);
                            args.splice(1, 0, this.language);
                            return this._translate.apply(this, args);
                        },

                        _translate: function (value, lang, section) {
                            var placeholders = [],
                                translated;

                            section = this._checkSectionParameter(section);

                            if (!this._dictionary || !this._dictionary[lang] ) {
                                if (_this.fallback && typeof _this.fallback === "object" && _this.fallback[value]) {
                                    translated = _this.fallback[value];
                                }
                            }
                            else {
                                if( !this._dictionary[lang].sections[section] )
                                {
                                    throw new Error('The section you are trying to access do not exsists');
                                }
                                if( !this._dictionary[lang].sections[section].translation[value] )
                                {
                                    throw new Error('The translation for \''+ value +'\' in the section \''
                                        + section +'\' for \''+ lang +'\' does not exists');
                                }
                                translated = this._dictionary[lang].sections[section].translation[value];
                            }

                            for (var i = 2; i < arguments.length; i++) {
                                placeholders.push(arguments[i]);
                            }

                            if (translated === null) {
                                translated = sprintf(value, placeholders);
                            }
                            else {
                                translated = sprintf(translated, placeholders);
                            }

                            return translated;
                        },

                        addTranslationObject: function (lang, json, section) {
                            if( !_this.allowPartialFileLoading && section !== 'all')
                            {
                                throw new Error('Partial loading has been disable by the provider.');
                            }

                            if( !this._dictionary[lang] )
                            {
                                this._dictionary[lang] =
                                {
                                    translation: null,
                                    sections: {}
                                }
                            }
                            this._loadTranslationFileSucceed(json, lang, section);
                        },

                        removeTranslationObject: function (lang, section) {
                            section = angular.isDefined(section) ? section : 'all';

                            if (this._dictionary[lang] && (this._dictionary[lang].loading === true
                                || this._dictionary[lang].loaded === true)) {
                                return;
                            }
                            delete this._dictionary[lang];
                        },


                        loadTranslationFile: function (lang, section) {
                            var self = this,
                                deferrer,
                                loadedFilePromise;

                            section = this._checkSectionParameter(section);

                            if (this._dictionary[lang]
                                && this._dictionary[lang].sections[section]
                                && (this._dictionary[lang].sections[section].loading === true
                                || this._dictionary[lang].sections[section].loaded === true)) {
                                return;
                            }

                            //  create the translation object
                            if( !this._dictionary[lang] )
                            {
                                this._dictionary[lang] = {
                                    sections: {}
                                };
                            }

                            this._dictionary[lang].sections[section] = {
                                loaded: false,
                                loading: true,
                                translation: null
                            };

                            //  we will store the promise here.
                            if( !this._promises[lang] )
                            {
                                this._promises[lang] = {};
                            }

                            //  create the promise we will return
                            deferrer = $q.defer();
                            loadedFilePromise = deferrer.promise;
                            loadedFilePromise.success = function (fn) {
                                loadedFilePromise.then(fn);
                                return loadedFilePromise;
                            };
                            loadedFilePromise.error = function (fn) {
                                loadedFilePromise.then(null, fn);
                                return loadedFilePromise;
                            };

                            var _loadTranslationFile = function(lang, section, urlIndex)
                            {
                                var url;

                                if( angular.isArray(_this._fileURL) )
                                {
                                    urlIndex = angular.isDefined(urlIndex) ? urlIndex : 0;
                                    url = _this._fileURL[urlIndex];
                                }
                                else
                                {
                                    url = _this._fileURL
                                }

                                url = url.replace(_this._fileURLLanguageToken, lang.replace('-', '_'));
                                if( _this._allowPartialFileLoading )
                                {
                                    if( url.indexOf(_this._fileURLPartToken) === -1 )
                                    {
                                        new Error('The file URL doesn\'t defined a token for partial loading');
                                    }
                                    url = url.replace(_this._fileURLPartToken, section);
                                }
                                url = _this.baseHref + url;

                                return $http({method: "GET", url: url, cache: false})
                                    .success(function (data, status, headers, config) {
                                        deferrer.resolve();
                                        self._loadTranslationFileSucceed(data, lang, section);
                                    })
                                    .error(function () {
                                        if( angular.isNumber(urlIndex) )
                                        {
                                            urlIndex++;
                                        }
                                        //  we tried all the url none can be resolved
                                        if ( typeof _this._fileURL === 'string' || urlIndex === _this._fileURL.length) {
                                            deferrer.reject('None of the URL can be reach');
                                            var urls = angular.isArray(_this._fileURL) ? _this._fileURL.join(', ') : _this._fileURL;
                                            for (var promiseObject in self._promises[lang]) {
                                                if (self._promises[lang].hasOwnProperty(promiseObject)) {
                                                    self._promises[lang][promiseObject]
                                                        .deferrer
                                                        .reject("Could not load translation files from " + urls);
                                                    self._dictionary[lang].sections = null;
                                                    delete self._promises[lang][promiseObject];
                                                }
                                            }
                                        }
                                        //  try the next url
                                        else {
                                            _loadTranslationFile(lang, section, urlIndex)
                                        }
                                    });
                            };



                            //  if we have an array of urls try resolve until one is valid
                            _loadTranslationFile(lang, section);

                            return loadedFilePromise;
                        },

                        //  loading translation file for current language succceed
                        _loadTranslationFileSucceed: function (data, lang, section) {
                            var self = this,
                                translation = {};

                            section = this._checkSectionParameter(section);

                            //  store the returned array in the dictionary
                            self._dictionary[lang].sections[section] = {
                                loading: true,
                                loaded: false,
                                translation: data
                            };

                            //  loop into any promises yet to be resolved for this language
                            for (var promiseObject in self._promises[lang]) {
                                if (self._promises[lang].hasOwnProperty(promiseObject)) {
                                    self._promises[lang][promiseObject].deferrer.resolve(self._translate.apply(self, self._promises[lang][promiseObject].arguments));
                                    delete self._promises[lang][promiseObject];
                                }
                            }

                            //  broadcast that the file has been loaded
                            $rootScope.$broadcast('i18nUpdated');
                        },

                        translate: function (value, section) {
                            var self = this;

                            section = this._checkSectionParameter(section);

                            //  define the language used when translation was called
                            var lang = self.language,
                                deferrer = null,
                                args = Array.prototype.slice.call(arguments);

                            // add the language to the argument array
                            args.splice(1, 0, lang);
                            // add the section to the argument array
                            args.splice(2, 1, section);

                            var addPromise = function (args, instant) {
                                instant = typeof instant !== 'undefined' ? instant : false;

                                var deferrer = null,
                                    promise = null;

                                //  a promise exists for this value for this language returns it
                                if (self._promises[lang] && self._promises[lang][value]) {
                                    return self._promises[lang][value].deferrer;
                                }

                                //  no promise exists for this value, create it
                                else {
                                    deferrer = $q.defer();
                                    promise = deferrer.promise;
                                    promise.success = function (fn) {
                                        promise.then(fn);
                                        return promise;
                                    };
                                    promise.error = function (fn) {
                                        promise.then(null, fn);
                                        return promise;
                                    };

                                    if (!instant) {
                                        self._promises[lang][value] = {arguments: args, deferrer: deferrer};
                                    }
                                    return deferrer;
                                }
                            };

                            if( value === '')
                            {
                                var failedDeferrer = addPromise(args, true);
                                failedDeferrer.reject('No translation ID were provided');
                                return failedDeferrer.promise;
                            }

                            //  we haven't load the file yet
                            if (!this._dictionary[lang]
                                || (!this._dictionary[lang].sections[section])
                                || (!this._dictionary[lang].sections[section].loading
                                    && !this._dictionary[lang].sections[section].loaded)) {
                                this.loadTranslationFile(lang, section);
                            }

                            //  we have called the loading process but we are still waiting on the file
                            if (this._dictionary[lang].sections[section].loading) {
                                return addPromise(args).promise;
                            }

                            //  the translation file finished loading
                            if (this._dictionary[lang]
                                && !this._dictionary[lang].sections[section].loading
                                && this._dictionary[lang].sections[section].loaded) {
                                deferrer = addPromise(args, true);
                                //  unsuccessfully
                                if (this._dictionary[lang].sections[section].translation === null
                                    || typeof this._dictionary[lang].sections[section].translation !== "object") {
                                    deferrer.reject("The translation file doesn't exists");
                                }
                                //  successfully
                                else {
                                    deferrer.resolve(self._translate.apply(self, args));
                                }
                                return deferrer.promise;
                            }
                        }
                    };
                }]
        };
    }])

    .filter('i18n', ['$i18n', function ($i18n) {
        var currentLanguage = null;
        var myFilter = function (translationId, section) {
            if (!angular.isString(translationId)) {
                throw new Error('i18n filter error: The translation id must be a string');
            }

            if (angular.isDefined(section) && !angular.isString(section)) {
                throw new Error('i18n filter error: The section id must be a string');
            }
            var translation = $i18n._getLanguageAndTranslate.apply($i18n, arguments);
            if (currentLanguage === null || currentLanguage !== $i18n.language) {
                currentLanguage = $i18n.language;
                angular.isDefined(section)
                    ? $i18n.loadTranslationFile(currentLanguage, section)
                    : $i18n.loadTranslationFile(currentLanguage)
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
                var tag = $i18n._getLanguageAndTranslate(attrs.i18n, attrs.i18nSection);
                elm.text(tag);

                $i18n.translate(attrs.i18n)
                    .success(function (translated) {
                        elm.text(translated)
                    });
            }
        }
    }]);
