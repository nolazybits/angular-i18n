// Sub-application/main Level State
app.config(['$stateProvider', function ($stateProvider) {

    $stateProvider
        .state('app', {
            url: '',
            views: {
                'main': {
                    templateUrl: 'js/main/home/home.tpl.html',
                    controller: 'HomeController',
                    controllerAs: 'ctrl'
                }
            }
        })
}]);