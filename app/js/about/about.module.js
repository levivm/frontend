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
                url: '/conocenos/',
                controller: 'AboutController as about',
                templateUrl: 'partials/about/about.html'
            })
            .state('about.mission', {
                url: 'mision',
                templateUrl: 'partials/about/mission.html',
                metaTags:{
                    title:'¡Conócenos! | Trulii',
                    description: 'Encuentra aquí todo sobre Trulii, cómo funcionamos, qué beneficios te ofrecemos, nuestra historia y todo lo que tenemos para ti. ¡Anímate a conocernos!'
                }
            }) 
            .state('about.culture', {
                url: 'cultura',
                templateUrl: 'partials/about/culture.html',
                metaTags:{
                    title:'¡Conócenos! | Trulii',
                    description: 'Encuentra aquí todo sobre Trulii, cómo funcionamos, qué beneficios te ofrecemos, nuestra historia y todo lo que tenemos para ti. ¡Anímate a conocernos!'
                }
            })
            .state('about.team', {
                url: 'equipo',
                templateUrl: 'partials/about/team.html',
                metaTags:{
                    title:'¡Conócenos! | Trulii',
                    description: 'Encuentra aquí todo sobre Trulii, cómo funcionamos, qué beneficios te ofrecemos, nuestra historia y todo lo que tenemos para ti. ¡Anímate a conocernos!'
                }
            })
            .state('about.terms', {
                url: 'terminos',
                templateUrl: 'partials/about/terms.html'
            })
            .state('about.privacy-policy', {
                url:'politicas',
                templateUrl: 'partials/about/privacy.html'
            });
    }
})();
