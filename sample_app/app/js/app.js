var app = angular.module('app',
    [
        'ui.router',
        'ngMaterial',
        'angular-i18n'
    ])
    .config(['$i18nProvider', function($i18nProvider) {
        //  we define/force the language as en_US
        $i18nProvider.language = 'en_US';
        //  we allow partial loading
        $i18nProvider.allowPartialFileLoading = true;
        //  modifying the fileURL to add the token for the part
        $i18nProvider.fileURL = '/i18n/|LANG|.|PART|.json';
        //  set the debug mode to true, so we can use the onTranslationFailed
        $i18nProvider.debug = true;
        //  return a string is we don't find the translationID
        $i18nProvider.onTranslationFailed = function(lang, translationID, section, placeholders)
        {
            return '<span style="color: red">' + translationID + '</span>';
        }
    }])
    .run(['$state', function($state)
    {
        console.log($state);
    }]);