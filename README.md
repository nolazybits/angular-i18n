angular-i18n is a small Angular module in charge of i18n.

### Dependencies

This module ```angular-i18n``` has dependencies resolved with bower on:
* sptrinf ("sprintf")

### Usage

This module has:
* a provider ($i18n) 
* a filter (i18n)
* a directive (i18n).

#### Setup

Load the javascript and add the module ```angular-i18n``` in the dependencies  
```
<script src="angular-i18n.js"></script>
<script type="application/javascript">
	var myapp = angular.module('myapp', ['angular-i18n']);
</script>
```  

##### JSON files  
The en-US.json file looks like this  
```
{
    "HELLO_WORLD" : "Hello World",
    "NAME_AGE" : "My name is %s and i am %d years old."
}
```

The fr-FR.json file looks like this
```
{
    "HELLO_WORLD" : "Bonjour Monde",
    "NAME_AGE" : "Mon prenom est %s et j'ai %d ans."
}
```

#### Provider '$i18n'
The provider has the following methods

| Methods | Description | Default |
| :-------| ----------- | ------- |
| [setPathLanguageURL](#setpathlanguageurl) | Set the template URL where translation file will be loaded from | ```'/i18n/|LANG|.json'``` |
| [setPathLanguageRegex](#setpathlanguageregex) | The regex to look for which will be replaced with the current language string id (i.e en**_**US) to be loaded | ```/\|LANG\|/``` |
| [setDefaultLanguage](#setdefaultlanguage) | The default language to use | ```'en-US'``` |       
| [setLanguage](#setlanguage) | The language to use | ```null``` |       
| [setFallback](#setfallback) | The fallback translation object if the translation file failed to load | ```null``` |  

Example:  
```
    $i18nProvider
    	.setPathLanguageURL('/i18n/|LANG|.json')
        .setPathLanguageRegex(/\|LANG\|/)
        .setDefaultLanguage('en-US')
        .setFallback({'WELCOME': 'FALLBACK WELCOME %s', 'GOODBYE': 'FALLBACK WELCOME GOODBYE'})
```  

##### setPathLanguageURL  
> Set the template URL where translation file will be loaded from  
**default:** ```'/i18n/|LANG|.json'```  

The template URL contains a token that will be replaced (using regex replace) with the current language id.  
**Note:** the language id will have the the '-' replaced with '_' (i.e 'en-US' will become en_US).  
e.g: if you have a language set to 'en-US' the file */i18n/en_US.json* will be loaded.

##### setPathLanguageRegex
> The regex to look for which will be replaced with the current language string id (i.e en**_**US) to be loaded  
**default:** ```/\|LANG\|/```  

This is the regular expression that will be looked for and replaced with the language id in the path template URL.  
Note: the language id will have the the '-' replaced with '_' (i.e 'en-US' will become en_US).  
So if you have a language set to 'en-US' the file */i18n/en_US.json* will be loaded.

##### setDefaultLanguage
> The default language to use  
**default:** ```'en-US'```

##### setFallback
> The fallback translation object if the translation file failed to load  
**default:** ```null```

#### Service '$18n'  
The correct language to display is determine by the provider, based on the language of the browser, the default language set or the current language set (if any) as follow:  ```language || $window.navigator.userLanguage || $window.navigator.language || defaultLanguage;```  

The service can use all the provious method described in the [provider](#provider-i18n) section plus the following:

| Methods | Description |  
| :-------| ----------- |  
| [getCurrentLanguage](#getcurrentlanguage) | The language to use |  
| [getTranslation](#gettranslation) | Translate instantaneously, used by the filter |  
| [loadTranslationFile](#loadtranslationfile) | Loads the translation file for the current language using the URL and regexp provided at config time |  
| [translate](#translate) | Return a promise. **THIS IS** the function you want to use |  

##### getCurrentLanguage
> Returns the current language.  

The returned value check first the language property (can be set at runtime), then browser language and finally the default language (can be set at config and run time)

##### getTranslation
> Returns a translation instantaneously  

This will return a translation instantaneously. So if the translation file is not loaded yet, this function will return either the fallback translation or null.

##### loadTranslationFile
> Loads the translation file for the current language using the URL and regexp provided at config time 

##### translate
> Return a promise. **THIS IS** the function you want to use 

This will return a promise that can be used to update your scope, model, ...

#### Filter 'i18n'
```
{{ 'TRANSLATION_ID' | i18n }}  
```

#### Directive 'i18n'
```
<span i18n="TRANSLATION_ID"></span>
```
