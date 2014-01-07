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
            //	path to for localization
                path: 'i18n/',
			
            //  use the $window service to get the language of the user's browser
                language : $window.navigator.userLanguage || $window.navigator.language,

            //  array to hold the localized resource string entries
                dictionary : undefined,

            //  flag to indicate if the service has loaded the resource file
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
                   //  build the URL to retrieve the localized resource file
                    var url = localize.path + localize.language + '.json';

                    //  request the resource file
                    $http({ method:"GET", url:url, cache:false })
                    .success(localize.successCallback)
                    .error
                    (
                        function ()
                        {
                        //  the request failed set the URL to the default resource file
                            var url = localize.path + 'default.json';
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
                },
				
				replace: function(elm, str)
				{
					var tag = localize.getLocalizedString(str);
                //  update the element only if data was returned
                    if( (tag !== null) && (tag !== undefined) && (tag !== '') )
                    {
                    //  insert the text into the element
                        elm.html(tag);
                    }
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
            return function ()
            {
                return localize.getLocalizedString.apply(null, arguments);
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
					var str = attrs.i18n ? attrs.i18n : elm.html();
					
					if (localize.resourceFileLoaded)
					{
						localize.replace(elm, str);
					}
					else
					{
                        deregister = scope.$on('localizeResourcesUpdates',
                        function()
                        {
                            deregister();
                            localize.replace(elm, str);
                        });
                    }
                }
            }
        }
    ]
);
