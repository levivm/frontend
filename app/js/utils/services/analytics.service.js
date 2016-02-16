/**
 * @ngdoc service
 * @name trulii.utils.services.Analytics
 * @description Error Handling Service
 */

(function () {
    'use strict';

    angular
        .module('trulii.utils.services')
        .factory('Analytics', Analytics);

    Analytics.$inject = [];

    function Analytics() {

        var generalEvents = {
                
        };

        var organizerEvents = {

        };

        var studentEvents = {

        };

        console.log(window.ga());

        //noinspection UnnecessaryLocalVariableJS
        var service = {

        };

        return service;


    }

})();
