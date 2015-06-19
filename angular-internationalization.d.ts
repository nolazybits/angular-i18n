// Type definitions for angular-internationalization
// Project: https://github.com/nolazybits/angular-i18n
// Definitions by: Xavier Martin http://nolazybits.com | http://dev.webbymx.net
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module angular.i18n {
    interface II18nProvider {
        allowPartialFileLoading: boolean;
        baseHref: string;
        defaultLanguage: string;
        fallback: JSON;
        fileURL: string;
        fileURLLanguageToken: RegExp|string;
        fileURLPartToken: RegExp|string;
        language: string;
        useBaseHrefTag: boolean;
    }

    interface II18n {
        language: string;
        addTranslationObject(lang: string, json: string, section?: string): void;
        removeTranslationObject(lang: string, section?:string): void;
        loadTranslationFile (lang:string, section?: string): void;
        translate (id:string, section?: string): II18nPromise;
    }

    interface II18nPromiseCallback {
        (translation:string): void;
    }

    interface II18nPromise extends ng.IPromise<string> {
        success(callback:II18nPromiseCallback): II18nPromise;
        error(callback:II18nPromiseCallback): II18nPromise;
    }

}