[![wercker status](https://app.wercker.com/status/4c29fbca7d6e75236843bdb3752f2273/m "wercker status")](https://app.wercker.com/project/bykey/4c29fbca7d6e75236843bdb3752f2273)      

angular-i18n is a small Angular module in charge of internationalization and localization.  

### Dependencies

This module ```angular-i18n``` has dependencies resolved with bower on:
* sptrinf ("sprintf")

### Usage

This module has:
* a [provider](#provider-i18n) ($i18nProvider) 
* a [factory](#factory-i18n) ($i18n) 
* a [filter](#filter-i18n) (i18n)
* a [directive](#directive-i18n) (i18n).

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
| Property | Description | Default |  
| :-------| ----------- | ------- |  
| [allowPartialFileLoading](#allowpartialfileloading) | Set if you want to be able to load multiple files for a language | ```false``` |  
| [baseHref](#basehref) | the base href as found by this library | ```''``` if not provided by html page |
| [debug](#debug) | debug mode | ```false``` |
| [defaultLanguage](#defaultlanguage) | The default language to use | ```'en-US'``` |  
| [fallback](#fallback) | The fallback translation object if the translation files failed to load | ```null``` |  
| [fileURL](#fileurl) | Set the template URL(s) where translation files will be loaded from.| ```'/i18n/|LANG|_|PART|.json'``` |  
| [fileURLLanguageToken](#fileurllanguagetoken) | The token (string\|regex) to look for in the fileURL which will be replaced with the current language string id (i.e en**_**US) to be loaded | ```/\|LANG\|/``` |  
| [fileURLPartToken](#fileurlparttoken) | The token (string\|regex) to look for in the fileURL which will be replaced with the current section string id (i.e home) to be loaded | ```/\|PART\|/``` |         
| [language](#language) | The language to use | ```null``` |
| [onTranslationFailed](#ontranslationfailed) | This function is called when the debug mode is on and the translation failed on filter or directives | ```null``` |
| [useBaseHrefTag](#usebasehreftag) | Should the library prepend the base tag url to the pathLanguageURL (this to help with relative links) | ```false``` |    

Example:  
```
    $i18nProvider.allowPartialFileLoading = true;
    $i18nProvider.defaultLanguage = true;
    $i18nProvider.defaultLanguage = 'fr-FR';
    $i18nProvider.fallback = {'welcome': 'falback welcome home'};
    $i18nProvider.fileURL = '/i18n/|LANG|.|PART|.json';
    $i18nProvider.fileURLLanguageToken = /\|LANG\|/;
    $i18nProvider.fileURLPartToken = /\|PART\|/;
    $i18nProvider.language = 'en-GB';
    $i18nProvider.onTranslationFailed = function(lang, translationID, section, placeholders) {...};
    $i18nProvider.useBaseHrefTag = true;
```  

##### allowPartialFileLoading  
> Set if you want to be able to load multiple files for a language  
**default:** ```false```  

Please check the [partial loading](#using-partial-loading) section in this documentation.

##### debug
> The debug mode      
**default:** ```false```

##### defaultLanguage
> The default language  
**default:** ```'en-US'```

##### fallback
> The fallback translation object if the translation file(s) failed to load  
**default:** ```null```

##### fileURL  
> Set the template URL(s) where the translation file(s) will be loaded from  
**default:** ```'/i18n/|LANG|.json'```  

The template URL contains a language token that will be replaced (using regex replace) with the current language id.  
The URL can also contain a optional part token needed if you have set [```allowPartialFileLoading```](#allowpartialfileloading) to ```true```  
For more information the [partial loading](#using-partial-loading) section in this documentation.  

**Note: the language id will have the the '-' replaced with '_' (i.e 'en-US' will become en_US).  
e.g: if you have a language set to 'en-US' the file */i18n/en_US.json* will be loaded.**

##### fileURLLanguageToken
> The string or regex to look for which will be replaced with the current language string id (i.e en**_**US) to be loaded  
**default:** ```/\|LANG\|/```  

This is the string or regular expression that will be looked for and replaced with the language id in the path template URL.  

**Note:** the language id will have the the '-' replaced with '_' (i.e 'en-US' will become en_US).  
So if you have a language set to 'en-US' the file */i18n/en_US.json* will be loaded.  
If you are using the RegExp object double backslash like ```new RegExp('\\|LANG\\|');```


##### fileURLPartToken
> The string or regex to look for which will be replaced with the current section string id (i.e home) to be loaded  
**default:** ```/\|PART\|/```  

This is the string or regular expression that will be looked for and replaced with the section id in the path template URL.  

For more information, please check the [partial loading](#using-partial-loading) section in this documentation.

##### language
> The explicitly defined language  
**default:** ```null```

##### onTranslationFailed
> Function called when the debug mode is on and when the translation failed for filters or directives.  
> Must return a string  
**default:** ```null```  

example  
```
$i18nProvider.onTranslationFailed = function(lang, translationID, section, placeholders) {
    return '<span style="color: red">translationID</span>
};
```
The above function returns HTML and no plain text. To have Angular displays the HTML:   
- with the i18n directive nothing has to be done.  
- with the i18n filter you will have to do the following:  
 - use your filer inside an element and biding the filter value to ng-bind-html as    
 ```<span ng-bind-html="'translationID' | i18n:{section: ...}" />```  
 So note that the value returned by this function will be [$sce.trustAsHtml](https://docs.angularjs.org/api/ng/service/$sce#trustAsHtml)
 
Please check the sample app for examples.

##### useBaseHrefTag
> Should the library prepend the base tag url to the fileURL(s) (this to help with relative links) 
**default:** ```false```

#### Factory '$18n'  
The correct language to display is determine by the provider, based on the language of the browser, the default language set or the current language set (if any) as follow:  ```language || $window.navigator.userLanguage || $window.navigator.language || defaultLanguage;```  

The factory can use all the previous method described in the [provider](#provider-i18n) section plus the following:

| Property | Description |    
| :-------| ----------- |    
| [language](#language-1) | The language to use |  
| [debug](#debug) | reference the provider debug property | ```false``` |
| [onTranslationFailed](#ontranslationfailed) | Reference the provider onTranslationFailed property | ```null``` |

##### language
> Returns the current language.  

The returned value check first the language property (can be set at runtime), then browser language and finally the default language (can be set at config and run time)

| Events | Description |    
| :-------| ----------- |    
| [i18n.file.loaded](#i18n.file.loaded) | Dispatched when a translation file has been loaded |  

##### i18n.file.loaded
> Dispatched when a translation file has been loaded  

The arguments passed are:

 * lang: the language used
 * section: the section loaded (if any otherwise 'all')
 * data: the data received.
 

| Methods | Description |    
| :-------| ----------- |    
| [addTranslationObject(lang, json, section)](#addtranslationobject) | add a translation object directly to i18n |
| [removeTranslationObject(lang, section)](#removetranslationobject) | remove a translation object added or loaded to the library |
| [loadTranslationFile(lang, section)](#loadtranslationfile) | To explicitly start loading translation file(s) for the current language using the URL and regexp provided at config time  |
| [translate(value, section, placeholders)](#translate) | Return a promise. **THIS IS** the function you want to use on the factory |  

##### addTranslationObject(lang: string, json: string, section: string)
> add a translation directly to the library.
> lang: the language to add
> json: the json string
> (section): the section for the language file

This can prove usefull if you want to retrieve the translation object(s) yourself and then add them to this library.

##### removeTranslationObject(lang: string, section: string)
> remove a translation from the library
> lang: the language to remove from
> (section): the section to remove from

If no section are provided the whole language will be removed from the library.

**Note**: a section can only be provided if ```$i18nProvider.```[```allowPartialFileLoading```](#allowpartialfileloading) has been set to ```true```  

##### loadTranslationFile(lang: string, section: string)
> To explicitly start loading translation file(s) for the current language using the URL and regexp provided at config time
> lang: the language to remove from
> (section): the section to remove from

**Note**: a section can only be provided if ```$i18nProvider.```[```allowPartialFileLoading```](#allowpartialfileloading) has been set to ```true``` 

##### translate(value: string, section?: string, placeholders?: Array)
> Return a promise. **THIS IS** the function you want to use

The placeholders array is the value that are going to replace the sprintf placeholders. 

**Note**: a section can only be provided if ```$i18nProvider.```[```allowPartialFileLoading```](#allowpartialfileloading) has been set to ```true``` 

#### Filter 'i18n'
example:  
```
{{ 'TRANSLATION_ID' | i18n:{section:'sectionName', placeholders:['value1', 0]} }}  
```
note that the object parameter is optional as well as the section and placeholders property of the object. 

#### Directive 'i18n'
```<span i18n="TRANSLATION_ID"></span>```  
or if using partial loading  
```<span i18n="TRANSLATION_ID" i18n-parameters="{section: 'PART_ID', placeholders: ['value1', 0] }"></span>```  

### Using partial loading
'Partial loading' means being able to load translations stored in multiple files for a set language.  
This is useful if you don't want to download the WHOLE translation file for your WHOLE application but just the ones 
for the sections (or areas) of your application the user is accessing.

#### Setting up partial loading
* set ```allowPartialFileLoading``` to ```true```
* (optional) set the ```fileURLLanguageToken```. Default is the regex ```/\|LANG\|/```  
* (optional) set the ```fileURLPartToken```. Default is the regex ```/\|PART\|/```  
* (optional) set the ```fileURL``` to have both the language and part token in it. Default is ```'/i18n/|LANG|_|PART|.json'```.  
  The token ```|PART|``` will be replace by the _'section'_ name.
  Remember that the _fileURL_ can still define an array of URLs.
* when using the factory, filter or  directive you can pass the 'section' the translation is loaded for, like for instance:  
  * ```{{ 'myTranslationID' | i18n:'home' }}```  
  * ```i18n.translate('myTranslationID', 'home')```  
  * ```<span i18n="TRANSLATION_ID" i18n-section="home"></span>```
  
  So for all those, using the default values of the library the file ```'/i18n/en-US_home.json'``` will be loaded and the key ```myTranslationID``` retreived from it
  
Please note that each _'section'_ file will be stored independently. This means the same key can appear in different file.  
