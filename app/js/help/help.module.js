(function () {
    'use strict';

    angular
        .module('trulii.help', [
            'trulii.help.controllers'
        ])
        .config(config);

    angular
        .module('trulii.help.controllers', []);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('help', {
                url: '/ayuda',
                controller: 'HelpController as help',
                templateUrl: '/partials/help/help.html'
            });
    }
})();
