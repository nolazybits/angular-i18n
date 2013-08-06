'use_strict';

require
(
    [
        'angular'
    ],
    function(angular)
    {
        'use strict';

        angular.module('localization', [])

        //  create our localization service
        .factory
        (
            'localize',
            [
                '$http', '$rootScope', '$window',
                function($http, $rootScope, $window)
                {
                    var localize =
                    {
                    //  use the $window service to get the language of the user's browser
                        language : $window.navigator.userLanguage || $window.navigator.language || 'en-US',

                    //  array to hold the localized resource string entries
                        dictionary : undefined,

                    //  flag to indicate if the service hs loaded the resource file
                        resourceFileLoaded : false,

                        successCallback : function (data)
                        {
                        //  store the returned array in the dictionary
                            localize.dictionary = data;

                        //  set the flag that the resource are loaded
                            localize.resourceFileLoaded = true;

                        //  broadcast that the file has been loaded
                            $rootScope.$broadcast('localizeResourcesUpdates');
                        },

                        initLocalizedResources : function ()
                        {
                           //  build the url to retrieve the localized resource file
                            var url = '/i18n/' + localize.language + '.json';

                            //  request the resource file
                            $http({ method:"GET", url:url, cache:false })
                                .success(localize.successCallback)
                                .error
                            (
                                function ()
                                {
                                    //  the request failed set the url to the default resource file
                                    var url = '/i18n/default.json';
                                    //  request the default resource file
                                    $http({ method:"GET", url:url, cache:false })
                                        .success(localize.successCallback);
                                    //  TODO what happens if this call fails?
                                }
                            );
                        },

                        getLocalizedString : function (value)
                        {
                        //  Contextualize missing translation
                            var translated = '!' + value + '!';

                        //  check to see if the resource file has been loaded
                            if (!localize.resourceFileLoaded)
                            {
                            //  call the init method
                                localize.initLocalizedResources();
                            //  set the flag to keep from looping in init
                                localize.resourceFileLoaded = true;
                            //  return the empty string
                                return translated;
                            }

                        //  make sure the dictionary has valid data
                            if ( typeof localize.dictionary === "object" )
                            {
                                var log_untranslated = false;
                                var placeholders = [];

                                for(var i=1; i < arguments.length; i++)
                                {
                                    placeholders.push(arguments[i]);
                                }

                                var translate = function(value, placeholders)
                                {
                                    var placeholders = placeholders || null;
                                    var translated = localize.dictionary[value];
                                    if (translated === undefined)
                                    {
                                        if (log_untranslated == true)
                                        {
                                            //  Log untranslated value
                                        }
                                        return sprintf(value, placeholders);
                                    }
                                    return sprintf(translated, placeholders);
                                };

                                var result = translate(value, placeholders);
                                if ( (translated !== null) && (translated != undefined) )
                                {
                                    //  set the translated
                                    translated = result;
                                }
                            }
                            //  add watcher on the item to get the new string
                            else
                            {

                            }

                        //  return the value to the call
                            return translated;
                        }
                    };

                //  return the local instance when called
                    return localize;
                }
            ]
        )

        .filter
        (
            'i18n',
            [
                'localize',
                function (localize)
                {
                    return function (input)
                    {
                        return localize.getLocalizedString(input);
                    };
                }
            ]
        )

        .directive
        (
            'i18n',
            [
                'localize',
                function(localize)
                {
                    return {
                        restrict : "EAC",
                        link : function (scope, elm, attrs)
                        {
                        //  construct the tag to insert into the element
                            var tag = localize.getLocalizedString(attrs.i18n);

                        //  update the element only if data was returned
                            if( (tag !== null) && (tag !== undefined) && (tag !== '') )
                            {
                            //  insert the text into the element
                                elm.append(tag);
                            }
                        }
                    }
                }
            ]
        );
    }
);

