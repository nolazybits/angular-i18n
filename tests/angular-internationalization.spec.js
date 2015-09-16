describe('i18n', function ()
{
    var $i18nProvider;
    var $i18n;

    beforeEach(function ()
    {
        // Here we create a fake module just to intercept and store the provider
        // when it's injected, i.e. during the config phase.
        angular.module('dummyModule', ['angular-i18n'])
            .config(['$i18nProvider', function (_$i18nProvider_)
            {
                $i18nProvider = _$i18nProvider_;
            }]);

        module('angular-i18n', 'ngMock', 'dummyModule');

        // This actually triggers the injection into dummyModule
        inject(function() {});
    });

    describe('provider $i18nProvider', function()
    {
        it('should have default as defined in documentation',function()
        {
            expect($i18nProvider.defaultLanguage).toEqual('en-US');
            expect($i18nProvider.fileURL).toEqual('/i18n/|LANG|.json');
            expect($i18nProvider.fileURLLanguageToken).toEqual(/\|LANG\|/);
            expect($i18nProvider.fileURLPartToken).toEqual(/\|PART\|/);
            expect($i18nProvider.useBaseHrefTag).toBeFalsy();

            expect($i18nProvider.language).toBeNull();
            expect($i18nProvider.fallback).toBeNull();
            expect($i18nProvider.allowPartialFileLoading).toBeFalsy();
        });

        it('should keep assigned value', function()
        {
            $i18nProvider.useBaseHrefTag = true;
            expect($i18nProvider.useBaseHrefTag).toBeTruthy();

            $i18nProvider.allowPartialFileLoading = true;
            expect($i18nProvider.allowPartialFileLoading).toBeTruthy();

            $i18nProvider.fileURL = '/api/|LANGUAGE|/|PARTIAL|';
            expect($i18nProvider.fileURL).toEqual('/api/|LANGUAGE|/|PARTIAL|');

            $i18nProvider.fileURLLanguageRegex = /\|LANGUAGE\|/;
            expect($i18nProvider.fileURLLanguageRegex).toEqual(/\|LANGUAGE\|/);

            $i18nProvider.fileURLPartialRegex = /\|PARTIAL\|/;
            expect($i18nProvider.fileURLPartialRegex).toEqual(/\|PARTIAL\|/);

            $i18nProvider.defaultLanguage = 'fr-FR';
            expect($i18nProvider.defaultLanguage).toEqual('fr-FR');

            $i18nProvider.language= 'fr-FR';
            expect($i18nProvider.language).toEqual('fr-FR');

            $i18nProvider.fallback = {test:'test'};
            expect($i18nProvider.fallback).toEqual({test:'test'})
        });

        describe('not allowing partial file loading', function()
        {
            var $httpBackend;

            beforeEach(inject(function($injector)
            {
                //  set up the provider
                $i18nProvider.allowPartialFileLoading = false;
                $i18nProvider.fileURLLanguageRegex = /\|LANG\|/;
                $i18nProvider.fileURL = 'tests/mocks/|LANG|.home.json';
                $i18nProvider.language = 'en-US';

                //  define the jasmine timeout
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

                //  catch the http call and load the json file using
                //  httpBackend

                $httpBackend = $injector.get('$httpBackend');
                jasmine.getJSONFixtures().fixturesPath='base/tests/mocks';
                $httpBackend.whenGET('tests/mocks/en_US.home.json').respond(
                    getJSONFixture('en_US.home.json')
                );

                inject(function (_$i18n_)
                {
                    $i18n = _$i18n_;
                });
            }));

            describe('factory $i18n', function ()
            {
                it('should load the en_US.home.json file and translate', function(done)
                {
                    //this.loadTranslationFile(lang, append);
                    $i18n.translate('welcome')
                        .error(function()
                        {
                            this.fail();
                        })
                        .success(function(translated)
                        {
                            expect(translated).toEqual('Welcome home');
                            done();
                        });
                    $httpBackend.flush();
                });

                it('should translate sprintf format', function(done)
                {
                    //this.loadTranslationFile(lang, append);
                    $i18n.translate('sprintf.test', null, ['Karma', 10])
                        .error(function()
                        {
                            this.fail();
                        })
                        .success(function(translated)
                        {
                            expect(translated).toEqual('Karma,10');
                            done();
                        });
                    $httpBackend.flush();
                });

                describe('with fileURL being an array with first value non reachable', function () {

                    it('should load the en_US.home.json file and translate', function (done) {
                        $httpBackend.whenGET('tests/mocks/en_US.fail.json').respond(404, '');
                        $i18nProvider.fileURL = ['tests/mocks/|LANG|.fail.json', 'tests/mocks/|LANG|.home.json'];

                        //this.loadTranslationFile(lang, append);
                        var translation = $i18n.translate('welcome');
                        translation
                            .error(function () {
                                this.fail();
                            })
                            .success(function (translated) {
                                expect(translated).toEqual('Welcome home');
                                done();
                            });
                        $httpBackend.flush();
                    });
                });

                it('should return an error if we try to do partial loading', function()
                {
                    expect(function() { $i18n.translate('welcome', 'home'); }).toThrow( new Error('Partial loading has been disable by the provider.') );
                });
            });

            describe('filter i18n', function ()
            {
                var i18n;

                beforeEach(inject(function(){
                    inject(function($injector){
                        i18n = $injector.get('$filter')('i18n');
                    });
                }));

                it('should load the en_US.home.json file and translate', function(done)
                {

                    $i18n.loadTranslationFile($i18n.language)
                    .success(function(){
                        var translation = i18n('welcome');
                        expect(translation).toEqual('Welcome home');
                        done();
                    });
                    $httpBackend.flush();
                });

                it('should translate sprintf format', function(done)
                {

                    $i18n.loadTranslationFile($i18n.language)
                    .success(function(){
                        var translation = i18n('sprintf.test', {placeholders:['Karma', 10]});
                        expect(translation).toEqual('Karma,10');
                        done();
                    });
                    $httpBackend.flush();
                });

                it('should return an error if we try to do partial loading', function()
                {
                    expect(function() { i18n('welcome', {section:'home'}); }).toThrow( new Error('Partial loading has been disable by the provider.') );
                });

                it('should fail when trying to translate a non existing translationId', function(done)
                {

                    $i18n.loadTranslationFile($i18n.language)
                        .success(function(){
                            expect(function() { i18n('failId'); }).toThrow(
                                new Error('The translation for \'failId\' in the section \'all\' for \''
                                    + $i18n.language +'\' does not exists')
                            );
                            done();
                        });
                    $httpBackend.flush();
                });

                it('should call onTranslatedFailed when debug is on and onTranslationFailed set', function(done)
                {
                    $i18n.debug = true;
                    $i18n.onTranslationFailed = function() { return '';};
                    spyOn($i18n, 'onTranslationFailed').and.callThrough();

                    $i18n.loadTranslationFile($i18n.language)
                        .success(function(){
                            i18n('failId');
                            expect($i18n.onTranslationFailed).toHaveBeenCalledWith($i18n.language, 'failId', undefined, undefined);
                            done();
                        });
                    $httpBackend.flush();
                });

            });
        });

        describe('allowing partial file loading', function()
        {
            var $httpBackend;

            beforeEach(inject(function($injector)
            {
                //  set up the provider
                $i18nProvider.allowPartialFileLoading = true;
                $i18nProvider.fileURLLanguageRegex = /\|LANG\|/;
                $i18nProvider.fileURLPartialRegex = /\|PART\|/;
                $i18nProvider.fileURL = 'tests/mocks/|LANG|.|PART|.json';
                $i18nProvider.language = 'en-US';

                //  define the jasmine timeout
                jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

                //  catch the http call and load the json file using
                $httpBackend = $injector.get('$httpBackend');
                jasmine.getJSONFixtures().fixturesPath='base/tests/mocks';
                $httpBackend.whenGET('tests/mocks/en_US.home.json').respond(
                    getJSONFixture('en_US.home.json')
                );
                $httpBackend.whenGET('tests/mocks/en_US.login.json').respond(
                    getJSONFixture('en_US.login.json')
                );

                $httpBackend.whenGET('tests/mocks/en_US.fail.json').respond(404, '');

                inject(function (_$i18n_)
                {
                    $i18n = _$i18n_;
                });
            }));

            describe('factory $i18n', function ()
            {
                it('should load the en_US.home.json file and translate', function(done)
                {
                    //this.loadTranslationFile(lang, append);
                    $i18n.translate('welcome', 'home')
                        .error(function(){this.fail();})
                        .success(function(translated)
                        {
                            expect(translated).toEqual('Welcome home');
                            done();
                        });
                    $httpBackend.flush();
                });

                describe('with fileURL being an array with first value non reachable', function () {

                    it('should load the en_US.home.json file and translate', function (done) {
                        $httpBackend.whenGET('tests/mocks/en_US.fail.home.json').respond(404, '');
                        $i18nProvider.fileURL = ['tests/mocks/|LANG|.fail.|PART|.json', 'tests/mocks/|LANG|.|PART|.json'];

                        var translation = $i18n.translate('welcome', 'home');
                        translation
                            .error(function () {
                                this.fail();
                            })
                            .success(function (translated) {
                                expect(translated).toEqual('Welcome home');
                                done();
                            });
                        $httpBackend.flush();
                    });
                });

                it('should be able to do partial/sections loading', function(done)
                {
                    $i18n.translate('welcome', 'home')
                        .error(function(){this.fail();})
                        .success(function(translated)
                        {
                            expect(translated).toEqual('Welcome home');
                            $i18n.translate('welcome', 'login')
                            .error(function(){this.fail();})
                            .success(function(translated)
                            {
                                expect(translated).toEqual('Welcome login');
                                done();
                            });
                        });
                    $httpBackend.flush();
                });
            });

            describe('filter i18n', function ()
            {
                var i18n;

                beforeEach(inject(function(){
                    inject(function($injector){
                        i18n = $injector.get('$filter')('i18n');
                    });
                }));

                it('should load the en_US.home.json file and translate', function(done)
                {

                    $i18n.loadTranslationFile($i18n.language, 'home')
                    .success(function(){
                        var translation = i18n('welcome', {section: 'home'});
                        expect(translation).toEqual('Welcome home');
                        done();
                    });
                    $httpBackend.flush();
                });

                it('should fail when trying to load a non existing section', function(done)
                {

                    $i18n.loadTranslationFile($i18n.language, 'fail')
                    .finally(function(){
                        expect(function() { i18n('welcome', {section: 'fail'}); }).toThrow(
                            new Error('The section you are trying to access do not exists')
                        );
                        done();
                    });
                    $httpBackend.flush();
                });

                it('should fail when trying to translate a non existing translationId', function(done)
                {

                    $i18n.loadTranslationFile($i18n.language, 'home')
                        .success(function(){
                            expect(function() { i18n('failId', {section: 'home'}); }).toThrow(
                                new Error('The translation for \'failId\' in the section \'home\' for \''
                                    + $i18n.language +'\' does not exists')
                            );
                            done();
                        });
                    $httpBackend.flush();
                });

                it('should call onTranslatedFailed when debug is on and onTranslationFailed set', function(done)
                {
                    $i18n.debug = true;
                    $i18n.onTranslationFailed = function() { return '';};
                    spyOn($i18n, 'onTranslationFailed').and.callThrough();

                    $i18n.loadTranslationFile($i18n.language, 'home')
                        .success(function(){
                            i18n('failId', {section: 'home'});
                            expect($i18n.onTranslationFailed).toHaveBeenCalledWith($i18n.language, 'failId', 'home', undefined);
                            done();
                        });
                    $httpBackend.flush();
                });

            });
        });
    });
});
