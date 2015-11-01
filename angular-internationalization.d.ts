// Type definitions for angular-internationalization
// Project: https://github.com/nolazybits/angular-i18n
// Definitions by: Xavier Martin http://nolazybits.com | http://dev.webbymx.net
// Definitions: https://github.com/borisyankov/DefinitelyTyped

declare module angular.i18n {
    interface II18nProvider {
        allowPartialFileLoading: boolean;
        baseHref: string;
        debug: boolean;
        defaultLanguage: string;
        fallback: JSON;
        fileURL: string;
        fileURLLanguageToken: RegExp|string;
        fileURLPartToken: RegExp|string;
        language: string;
        onTranslationFailed: Function;
        useBaseHrefTag: boolean;
    }

    interface II18n {
        debug: boolean;
        language: string;
        onTranslationFailed: Function;
        addTranslation(lang: string, json: string, section?: string): void;
        removeTranslation(lang: string, section?:string): void;
        loadTranslation(lang:string, section?: string): void;
        hasTranslation(lang:string, section?: string, key?: string): void;
        isTranslationLoaded(lang:string, section?: string): void;
        translate (id:string, section?: string, placeholders?: string|number[]): II18nPromise;
    }

    interface II18nPromiseCallback {
        (translation:string): void;
    }

    interface II18nPromise extends ng.IPromise<string> {
        success(callback:II18nPromiseCallback): II18nPromise;
        error(callback:II18nPromiseCallback): II18nPromise;
    }

}