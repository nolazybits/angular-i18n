// Type definitions for angular-internationalization
// Project: https://github.com/nolazybits/angular-i18n
// Definitions by: Xavier Martin http://nolazybits.com | http://dev.webbymx.net
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module angular.i18n {
    interface II18nProvider {
        setUseBaseHrefTag (value:boolean): II18nProvider;
        setPathLanguageRegex (regex:RegExp): II18nProvider;
        setPathLanguageURL (templateUrl:string): II18nProvider;
        setDefaultLanguage (defaultLang:string): II18nProvider;
        setLanguage (lang:string): II18nProvider;
        setFallback (object:Object): II18nProvider;
    }

    interface II18n {
        getCurrentLanguage (): string;
        loadTranslationFile (lang:string): void;
        getTranslation (id:string): string;
        addLanguageFile(lang:string, file:Object):void;
        translate (id:string): II18nPromise;
    }

    interface II18nPromiseCallback {
        (translation:string): void;
    }

    interface II18nPromise extends ng.IPromise<string> {
        success(callback:II18nPromiseCallback): II18nPromise;
        error(callback:II18nPromiseCallback): II18nPromise;
    }

}