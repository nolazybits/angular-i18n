angular-i18n is a small Angular module in charge of i18n.
[![wercker status](https://app.wercker.com/status/4c29fbca7d6e75236843bdb3752f2273/m "wercker status")](https://app.wercker.com/project/bykey/4c29fbca7d6e75236843bdb3752f2273)


### Dependencies

This module ```angular-i18n``` has dependencies resolved with bower on:
* sptrinf ("sprintf")

### Usage

This module has:
* a provider ($i18nProvider) 
* a factory ($i18n) 
* a filter (i18n)
* a directive (i18n).

#### Setup

Load the javascript and add the module ```angular-i18n``` in the dependencies  
```
<script src="angular-internationalization.js"></script>
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
| [setUseBaseHrefTag](#setusebasehreftag) | Should the library prepend the base tag url to the pathLanguageURL (this to help with relative links) | ```false``` |  

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
> The default language  
**default:** ```'en-US'```

##### setLanguage
> The explicitly defined language  
**default:** ```null```

##### setFallback
> The fallback translation object if the translation file failed to load  
**default:** ```null```

##### setUseBaseHrefTag
> Should the library prepend the base tag url to the pathLanguageURL (this to help with relative links) 
**default:** ```false```

#### Factory '$18n'  
The correct language to display is determine by the provider, based on the language of the browser, the default language set or the current language set (if any) as follow:  ```language || $window.navigator.userLanguage || $window.navigator.language || defaultLanguage;```  

The factory can use all the previous method described in the [provider](#provider-i18n) section plus the following:

| Methods | Description |    
| :-------| ----------- |    
| [addLanguageFile](#addlanguagefile) | add a file directly to i18n. Used if want to download the file yourself |
| [getCurrentLanguage](#getcurrentlanguage) | The language to use |      
| [getTranslation](#gettranslation) | Translate instantaneously, used by the filter |            
| [loadTranslationFile](#loadtranslationfile) | Loads the translation file for the current language using the URL and regexp provided at config time |      
| [translate](#translate) | Return a promise. **THIS IS** the function you want to use |  
| [removeLanguage](#removelanguage) | Remove a language |  

##### addLanguageFile
> add a file directly to i18n. Used if want to download the file yourself 

##### getCurrentLanguage
> Returns the current language.  

The returned value check first the language property (can be set at runtime), then browser language and finally the default language (can be set at config and run time)

##### getTranslation
> Returns a translation instantaneously  

This will return a translation instantaneously. So if the translation file is not loaded yet, this function will return either the fallback translation or null.

##### loadTranslationFile
> Loads the translation file for the current language using the URL and regexp provided at config time 

##### removeLanguage
> Remove a language 

return void

##### translate
> Return a promise. **THIS IS** the function you want to use 

#### Filter 'i18n'
```
{{ 'TRANSLATION_ID' | i18n }}  
```

#### Directive 'i18n'
```
<span i18n="TRANSLATION_ID"></span>
```
