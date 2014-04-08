This module has been created by merging the work of 2 developers. See bottom of the page for credits.

**Dependencies**

This module has dependencies resolved with bower on:
* sptrinf ("sprintf")

**Usage**

This module has:
* a service (localize) 
* a filter (i18n)
* a directive (i18n).

Setup

```
<script src="localization.js"></script>
<script type="application/javascript">
	var myapp = angular.module('myapp', ['localization']);
</script>
```

Use it like this in your template (i18n is the filter)
```
{{'Hello World'|i18n}} 
{{"My name is %s and i am %d years old." | i18n:"Max":"98"}} 
```
	
Define your language JSON files in your approot/i18n/, named as the language you are targeting, ie
```
approot/i18n/en-US.json
```
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
