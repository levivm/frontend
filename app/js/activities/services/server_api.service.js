/**
 * @ngdoc service
 * @name trulii.activities.services.ActivityServerApi
 * @description Manager for Activity related API Endpoints
 * @requires trulii.routes.serverConf
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.services')
        .factory('ActivityServerApi', ActivityServerApi);

    ActivityServerApi.$inject = ['serverConf'];

    function ActivityServerApi(serverConf) {
        /**
         * @ngdoc function
         * @name trulii.locations.services.LocationManager#getAvailableCities
         * @description Returns an array of available cities
         * @methodOf trulii.locations.services.LocationManager
         * @return {Array} Available cities
         */
    }

})();