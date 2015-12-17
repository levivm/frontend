(function () {
    'use strict';

    angular
        .module('trulii.about', [
            'trulii.about.controllers'
        ])
        .config(config);

    angular
        .module('trulii.about.controllers', []);

    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('about', {
                abstract: true,
                url: '/about/',
                controller: 'AboutController as about',
                templateUrl: '/partials/about/about.html'
            })
            .state('about.mission', {
                url: 'mission',
                templateUrl: '/partials/about/mission.html'
            })
            .state('about.culture', {
                url: 'culture',
                templateUrl: '/partials/about/culture.html'
            })
            .state('about.team', {
                url: 'team',
                templateUrl: '/partials/about/team.html'
            })
            .state('about.terms', {
                url: 'terms',
                templateUrl: '/partials/about/terms.html'
            })
            .state('about.privacy-policy', {
                url:'privacy-policy',
                templateUrl: '/partials/about/privacy.html'
            });
    }
})();
