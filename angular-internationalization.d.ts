declare module ng.i18n {
    interface II18nProvider {
        setPathLanguageRegex (regex : RegExp): II18nProvider;
        setPathLanguageURL (templateUrl : string): II18nProvider;
        setDefaultLanguage (defaultLang : string): II18nProvider;
        setLanguage (lang : string): II18nProvider;
        setFallback (object:Object): II18nProvider;
    }

    interface II18nFactory {
        getCurrentLanguage (): string;
        loadTranslationFile (lang: string): void;
        getTranslation (id: string): string;
        translate (id: string): II18nPromise;
    }

    interface II18nPromiseCallback {
        (translation: string): void;
    }

    interface II18nPromise extends ng.IPromise<string> {
        success(callback: II18nPromiseCallback): II18nPromise;
        error(callback: II18nPromiseCallback): II18nPromise;
 /*       then<TResult>(successCallback: (response: IHttpPromiseCallbackArg<T>) => IPromise<TResult>, errorCallback?: (response: IHttpPromiseCallbackArg<any>) => any): IPromise<TResult>;
        then<TResult>(successCallback: (response: IHttpPromiseCallbackArg<T>) => TResult, errorCallback?: (response: IHttpPromiseCallbackArg<any>) => any): IPromise<TResult>;
*/    }


}