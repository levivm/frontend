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
                abstract: true,
                url: '/help',
                controller: 'HelpController as help',
                templateUrl: '<ui-view/>'
            })
            .state('help.organizer', {
                url: '/organizer',
                templateUrl: '/partials/help/organizer.html'
            })
            .state('help.student', {
                url: '/student',
                templateUrl: '/partials/help/student.html'
            });
    }
})();
