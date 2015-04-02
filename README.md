angular-i18n is a small Angular module in charge of i18n.

###Dependencies###

This module ```angular-i18n``` has dependencies resolved with bower on:
* sptrinf ("sprintf")

###Usage###

This module has:
* a provider ($i18n) 
* a filter (i18n)
* a directive (i18n).

####Setup####

Load the javascript and add the module ```angular-i18n``` in the dependencies  
```
<script src="angular-i18n.js"></script>
<script type="application/javascript">
	var myapp = angular.module('myapp', ['angular-i18n']);
</script>
```  

####Configuration####  
The provider can be configured using the following:
| Methods              | Description                                                                                                   |
| -------------------- | ------------------------------------------------------------------------------------------------------------- |
| setPathLanguageURL   | Set the template URL where translation file will be loaded from                                               |
| setPathLanguageRegex | The regex to look for which will be replaced with the current language string id (i.e en**_**US) to be loaded |
| setDefaultLanguage   | The default language to use                                                                                   |       
| setLanguage          | The language to use                                                                                           | 
| setFallback          | The fallback translation object if the translation file failed to load                                        |


```
    $i18nProvider
        .setPathLanguageRegex(/\|LANG\|/)
        .setPathLanguageURL('/i18n/|LANG|.json')
        .setDefaultLanguage('en_US')
        .setFallback({'WELCOME': 'FALLBACK WELCOME %s', 'GOODBYE': 'FALLBACK WELCOME GOODBYE'})
```

####Filter 'i18n'3333
Use it like this in your template
```
{{ 'TRANSLATION_ID' | i18n }}  
```

Configuration is possible by passing in variables defined in your own app's `$rootScope`  (not sure if this is the best way to do this, but hey-ho).

The correct language to display is determine by the service part of this module, based on the language of the browser. However the desired language can also be passed in from `$rootScope` with the variable `$rootScope.lang`

Define your language JSON files named as the language you are targeting, ie
```
/i18n/en-US.json
```

If your lang files can't be placed under "/i18n/", the location can be passed in as the variable `$rootScope.i18nPath`

The JSON files must exist, but can be empty. If they're empty, each string will fall back to the string on which the filter is acting, until translated.

The en-US.json file looks like this
```
{
    "Hello World" : "Hello World",
    "My name is %s and i am %d years old." : "My name is %s and i am %d years old."
}
```

The fr-FR.json file looks like this
```
{
    "Hello World" : "Bonjour Monde",
    "My name is %s and i am %d years old." : "Mon prenom est %s et j'ai %d ans."
}
```
	
**Credits**
* Jenu : marco.mich...@gmail.com from https://groups.google.com/forum/#!msg/angular/9C1F6PJ5KVY/7jSZTKXRCokJ 
* Jim Lavin : http://codingsmackdown.tv/blog/2012/12/14/localizing-your-angularjs-app/
