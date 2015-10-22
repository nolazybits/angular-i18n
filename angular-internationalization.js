angular.module('angular-i18n', ['ng'])
    //  create our localization service
    .provider('$i18n', [function () {
        return {
            _fileURL: '/i18n/|LANG|.json',
            _fileURLLanguageToken: /\|LANG\|/,
            _fileURLPartToken: /\|PART\|/,
            _allowPartialFileLoading: false,
            _useBaseHrefTag: false,
            _baseHref: '',
            _defaultLanguage: 'en-US',
            _language: null,
            _fallback: null,
            _debug: false,
            _onTranslationFailed: null,
            
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
            
            get debug() {
                return this._debug;
            },
            set debug(value) {
                this._debug = value;
                return this;
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
            
            get onTranslationFailed() {
                return this._onTranslationFailed;
            },
            set onTranslationFailed(func) {
                if (func === null || func && {}.toString.call(func) == '[object Function]') {
                    this._onTranslationFailed = func;
                }
                else {
                    throw new TypeError('the argument func of displayUntranslated(func) must be a function');
                }
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
            
            $get: ['$http', '$rootScope', '$window', '$q', '$log',
                function ($http, $rootScope, $window, $q, $log) {
                    var _this = this;
                    return {
                        _dictionary: {},
                        _promises: {},
                        
                        get debug() {
                            return _this.debug;
                        },
                        set debug(value) {
                            _this.debug = value;
                            return this;
                        },
                        
                        get language() {
                            return _this.language || $window.navigator.userLanguage
                                || $window.navigator.language || _this.defaultLanguage;
                        },
                        set language(lang) {
                            _this.language = lang;
                            return this;
                        },
                        
                        get onTranslationFailed() {
                            return _this.onTranslationFailed;
                        },
                        set onTranslationFailed(func) {
                            _this.onTranslationFailed = func;
                            return this;
                        },
                        
                        _checkSectionParameter: function (section) {
                            section = angular.isDefined(section) && section !== null ? section : 'all';
                            if (!angular.isString(section)) {
                                throw new Error('section parameter must be of type string');
                            }
                            
                            if (!_this.allowPartialFileLoading && section !== 'all') {
                                throw new Error('Partial loading has been disable by the provider.');
                            }
                            return section;
                        },
                        
                        _getLanguageAndTranslate: function (value, section, placeholders) {
                            return this._translate(value, this.language, section, placeholders);
                        },
                        
                        _translate: function (value, lang, section, placeholders) {
                            var translated;
                            
                            //  return an empty string for undefined value
                            if (value === undefined || value === null) {
                                return '';
                            }
                            
                            section = this._checkSectionParameter(section);
                            placeholders = placeholders ? placeholders : [];
                            
                            if (!this._dictionary || !this._dictionary[lang]) {
                                if (_this.fallback && typeof _this.fallback === "object" && _this.fallback[value]) {
                                    translated = _this.fallback[value];
                                }
                            }
                            else {
                                if (!this.hasTranslation(lang, section))
                                {
                                    throw new Error('The section you are trying to access do not exists');
                                }
                                
                                if (!this.hasTranslation(lang, section, value))
                                {
                                    throw new Error('The translation for \'' + value + '\' in the section \''
                                        + section + '\' for \'' + lang + '\' does not exists');
                                }
                                
                                translated = this._dictionary[lang].sections[section].translation
                                    ? this._dictionary[lang].sections[section].translation[value]
                                    : null;
                            }
                            
                            if (translated === null) {
                                translated = vsprintf(value, placeholders);
                            }
                            else {
                                translated = vsprintf(translated, placeholders);
                            }
                            
                            return translated;
                        },

                        hasTranslation: function (lang, section, key) {
                            return (
                                this.isTranslationLoaded(lang, section)
                                && this._dictionary[lang].sections[section].translation !== null
                                && (angular.isDefined(key)
                                    ? this._dictionary[lang].sections[section].translation[key] !== undefined
                                    : this._dictionary[lang].sections[section].translation !== null)
                            );
                        },

                        isTranslationLoaded: function (lang, section) {
                            return (this._dictionary[lang]
                            && this._dictionary[lang].sections[section]
                            && this._dictionary[lang].sections[section].loaded === true);
                        },

                        addTranslation: function (lang, json, section) {
                            if (!_this.allowPartialFileLoading && section !== 'all') {
                                throw new Error('Partial loading has been disable by the provider.');
                            }
                            
                            if (!this._dictionary[lang]) {
                                this._dictionary[lang] =
                                {
                                    sections: {}
                                }
                            }
                            if (!this._promises[lang]) {
                                this._promises[lang] =
                                {
                                    sections: {}
                                }
                            }
                            this._loadTranslationFileSucceed(json, lang, section);
                        },
                        
                        removeTranslation: function (lang, section) {
                            section = angular.isDefined(section) && section !== null ? section : 'all';
                            if(!this.allowPartialFileLoading())
                            {
                                if(section !== 'all')
                                {
                                    throw new Error('removeTranslation: You cannot pass a section when not allowing partial file loading with allowPartialFileLoading()')
                                }
                            }
                            else if( !this.isTranslationLoaded(lang, section))
                            {
                                return;
                            }
                            delete this._dictionary[lang].sections[section];
                        },

                        loadTranslation: function (lang, section) {
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
                            if (!this._dictionary[lang]) {
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
                            if (!this._promises[lang]) {
                                this._promises[lang] = {sections: {}};
                            }
                            if (!this._promises[lang].sections[section]) {
                                this._promises[lang].sections[section] = {};
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
                            
                            var _loadTranslationFile = function (lang, section, urlIndex) {
                                var url;
                                
                                if (angular.isArray(_this._fileURL)) {
                                    urlIndex = angular.isDefined(urlIndex) ? urlIndex : 0;
                                    url = _this._fileURL[urlIndex];
                                }
                                else {
                                    url = _this._fileURL
                                }
                                
                                url = url.replace(_this._fileURLLanguageToken, lang.replace('-', '_'));
                                if (_this._allowPartialFileLoading) {
                                    if (!_this._fileURLPartToken.test(url)) {
                                        throw new Error('The file URL doesn\'t defined a token for partial loading');
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
                                        if (angular.isNumber(urlIndex)) {
                                            urlIndex++;
                                        }
                                        //  we tried all the url none can be resolved
                                        if (typeof _this._fileURL === 'string' || urlIndex === _this._fileURL.length) {
                                            self._dictionary[lang].sections[section].loaded = true;
                                            self._dictionary[lang].sections[section].loading = false;
                                            self._dictionary[lang].sections[section].translation = null;
                                            
                                            deferrer.reject('None of the URL can be reach');
                                            var urls = angular.isArray(_this._fileURL) ? _this._fileURL.join(', ') : _this._fileURL;
                                            for (var promiseObject in self._promises[lang].sections[section]) {
                                                if (self._promises[lang].sections[section].hasOwnProperty(promiseObject)) {
                                                    self._promises[lang].sections[section][promiseObject]
                                                        .deferrer
                                                        .reject("Could not load translation files from " + urls);
                                                    delete self._promises[lang].sections[section][promiseObject];
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
                                translation;
                            
                            section = this._checkSectionParameter(section);
                            
                            //  store the returned array in the dictionary
                            self._dictionary[lang].sections[section] = {
                                loading: false,
                                loaded: true,
                                translation: data
                            };
                            
                            //  loop into any promises yet to be resolved for this language
                            if( self._promises[lang] && self._promises[lang] && self._promises[lang].sections[section])
                            {
                                for (var promiseObject in self._promises[lang].sections[section]) {
                                    if (self._promises[lang].sections[section].hasOwnProperty(promiseObject)) {
                                        try {
                                            translation = self._translate.apply(self, self._promises[lang].sections[section][promiseObject].arguments);
                                            self._promises[lang].sections[section][promiseObject].deferrer.resolve(translation);
                                        }
                                        catch (e) {
                                            self._promises[lang].sections[section][promiseObject].deferrer.reject(e.message);
                                            $log.error(e);
                                        }

                                        delete self._promises[lang].sections[section][promiseObject];
                                    }
                                }
                            }

                            //  broadcast that the file has been loaded
                            $rootScope.$broadcast('i18n.file.loaded', lang, section, data);
                        },
                        
                        translate: function (value, section, placeholders) {
                            var self = this;
                            
                            section = this._checkSectionParameter(section);
                            
                            //  define the language used when translation was called
                            var lang = self.language,
                                deferrer = null,
                                args = Array.prototype.slice.call(arguments);
                            
                            // add the language to the argument array
                            args.splice(1, 0, lang);
                            
                            var addPromise = function (value, lang, section, placeholders, instant) {
                                instant = typeof instant !== 'undefined' ? instant : false;
                                
                                var deferrer = null,
                                    promise = null;
                                
                                //  a promise exists for this value for this language returns it
                                if (self._promises[lang] &&
                                    self._promises[lang].sections[section] &&
                                    self._promises[lang].sections[section][value]
                                ) {
                                    return self._promises[lang].sections[section][value].deferrer;
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
                                        self._promises[lang].sections[section][value] = {arguments: arguments, deferrer: deferrer};
                                    }
                                    return deferrer;
                                }
                            };
                            
                            if (value === '') {
                                var failedDeferrer = addPromise(value, lang, section, placeholders, true);
                                failedDeferrer.reject('No translation ID were provided');
                                return failedDeferrer.promise;
                            }
                            
                            //  we haven't load the file yet
                            if (!this._dictionary[lang]
                                || (!this._dictionary[lang].sections[section])
                                || (!this._dictionary[lang].sections[section].loading
                                && !this._dictionary[lang].sections[section].loaded)) {
                                this.loadTranslation(lang, section);
                            }
                            
                            //  we have called the loading process but we are still waiting on the file
                            if (this._dictionary[lang].sections[section].loading) {
                                return addPromise(value, lang, section, placeholders).promise;
                            }
                            
                            //  the translation file finished loading
                            if (this._dictionary[lang]
                                && !this._dictionary[lang].sections[section].loading
                                && this._dictionary[lang].sections[section].loaded) {
                                deferrer = addPromise(value, lang, section, placeholders, true);
                                //  unsuccessfully
                                if (this._dictionary[lang].sections[section].translation === null
                                    || typeof this._dictionary[lang].sections[section].translation !== "object") {
                                    deferrer.reject("The translation file doesn't exists");
                                }
                                //  successfully
                                else {
                                    var translation;
                                    try {
                                        translation = self._translate(value, lang, section, placeholders);
                                        deferrer.resolve(translation);
                                    }
                                    catch (e) {
                                        deferrer.reject(e.message);
                                        $log.error(e);
                                    }
                                }
                                return deferrer.promise;
                            }
                        }
                    };
                }]
        };
    }])
    
    .filter('i18n', ['$i18n', '$sce', '$compile', '$log', function ($i18n, $sce, $compile, $log) {
        var currentLanguage = null;
        var myFilter = function (translationId, object) {
            if (translationId && !angular.isString(translationId)) {
                throw new Error('i18n filter error: The translation id must be a string');
            }
            object = object ? object : {};
            
            if (angular.isDefined(object)) {
                if (angular.isDefined(object.section) && !angular.isString(object.section)) {
                    throw new Error('i18n filter error: The section id must be a string');
                }
                
                if (angular.isDefined(object.placeholders)
                    && Object.prototype.toString.call(object.placeholders) !== '[object Array]') {
                    throw new Error('i18n filter error: The placeholders must be an array');
                }
            }
            //  load translation file (if needed)
            $i18n.loadTranslation($i18n.language, object.section, object.placeholders);
            
            try {
                var translation = $i18n._getLanguageAndTranslate.call($i18n, translationId, object.section, object.placeholders);
            }
            catch (e) {
                if ($i18n.debug && $i18n.onTranslationFailed) {
                    translation = $sce.trustAsHtml($i18n.onTranslationFailed($i18n.language, translationId, object.section, object.placeholders));
                    $log.error(e);
                }
                else {
                    throw e;
                }
                
            }
            return translation;
        };
        myFilter.$stateful = true;
        return myFilter;
    }])
    
    .directive('i18n', ['$i18n', '$compile', '$log', function ($i18n, $compile, $log) {
        return {
            scope: {
                i18n: '=',
                i18nParameters: '=?'
            },
            priority: -1,
            restrict: "A",
            link: function (scope, elm, attrs) {
                scope.i18nParameters = angular.extend({}, scope.i18nParameters);
                $i18n.translate(scope.i18n, scope.i18nParameters.section, scope.i18nParameters.placeholders)
                    .success(function (translated) {
                        elm.text(translated)
                    })
                    .error(function (stringError) {
                        if ($i18n.debug && $i18n.onTranslationFailed) {
                            var translation = $i18n.onTranslationFailed($i18n.language, scope.i18n, scope.i18nParameters.section, scope.i18nParameters.placeholders);
                            elm.html(translation);
                            $compile(translation, scope);
                            $log.error(stringError);
                        }
                        else {
                            throw new Error(stringError);
                        }
                        
                    })
            }
        }
    }]);
