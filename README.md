This module has been created by merging the work of 2 developers. See bottom of the page for credits.

This module has:
* a service (localize) 
* a filter (i18n)
* a directive (i18n).

Use it like this in your template (i18n is the filter)
```
{{ 'Hello World' | i18n }} 
{{ "My name is %s and i am %d years old." | i18n:"Max":"98" }} 
```

The service part of the module will determine the language that should be displayed, based on the language of the browser. However the desired language can also be passed in from $rootScope with the variable $rootScope.lang

Define your language JSON files named as the language you are targeting, ie
```
/i18n/en-US.json
```

If your lang files can't be located at "/i18n/", the location can be passed in as the variable $rootScope.i18nPath (not sure if this is the best way to do this, but hey-ho).

The JSON files must exist, but can be empty. If they're empty, each string will fall back to the string on which the filter is acting until translated.

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
