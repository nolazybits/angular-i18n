* 2015-11-24   v1.2.4   fileURL can now be an array of URL to get translation file from. Hit in array order.  
* 2015-11-24   v1.2.3   Updated languages and fixed inability to wait for "loading" status on translation.  
* 2015-10-23   v1.2.2   Updated definition file.  
* 2015-10-23   v1.2.1   Fixed dictionnary lang is undefined in hasTranslation method.  
* 2015-10-22   v1.2.0    **Breaking changes**  
                        Changed ```addTranslationObject``` to ```addTranslation``` for better consistency   
                        Changed ```removeTranslationObject``` to ```removeTranslation```    
                        Changed ```loadTranslationFile``` to ```loadTranslation```    
* 2015-10-13   v1.1.9   Fix error when looking for promise in array with no record.
* 2015-08-07   v1.1.8   Fixed issue when loading multiple sections.
* 2015-08-07   v1.1.7   Change directive priority to be executed last
* 2015-08-03   v1.1.6   Fixed undefined check   
* 2015-07-23   v1.1.5   Fixed checking for section regex in string.  Added i18n.file.loaded event.  null or undefined i18n value on filter now translate to an empty string   
* 2015-07-14   v1.1.4   Updated directive.  Breaking change on parameters.   
* 2015-07-13   v1.1.3   Updated directive.  Added onTranslationFailed.   
* 2015-05-24   v1.1.2   Fixed sprintf format. **Breaking Change** filter get an object as parameter
* 2015-05-24   v1.1.1   Changes to allow dynamic sections in the filters
* 2015-05-13   v1.1.0   Breaking change. The library has been updated to use getter/setters.   
                        Now support partial file loading (check the doco)
* 2015-05-13   v1.0.10   Reject promise when file loading fails.
* 2015-05-13   v1.0.9   fix typescript typings
* 2015-05-06   v1.0.8   Updated bower.json file 
* 2015-05-06   v1.0.7   Added addLanguageFile and removeLanguage. 
* 2015-04-24   v1.0.6   Fixed error when fallback is not set  
* 2015-04-15   v1.0.5   Updated Typescript definition file  
* 2015-04-15   v1.0.4   Added base href tag support.  
* 2015-03-13   v1.0.3   Removed $timeout.  