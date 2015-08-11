//noinspection JSValidateJSDoc
/**
 * @ngdoc service
 * @name trulii.locations.services.LocationServerApi
 * @description API Service for Activity related Endpoints
 * @requires trulii.routes.serverConf
 */
(function () {
    'use strict';

    angular
        .module('trulii.locations.services')
        .factory('LocationServerApi', LocationServerApi);

    LocationServerApi.$inject = ['serverConf'];

    function LocationServerApi(serverConf) {

        var serverApi = serverConf.url + '/api/';
//        var apiVersion = 'v1';
        var debug = false;

        //noinspection UnnecessaryLocalVariableJS
        var api = {

            /**
             * @ngdoc function
             * @name trulii.activities.services.LocationServerApi#cities
             * @description Renders **`/api/locations/cities/`** Cities List URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.LocationServerApi
             */
            'cities' : function () {
                return renderUrl('locations/', ['cities/']);
            }
        };

        /**
         * @ngdoc function
         * @name trulii.activities.services.LocationServerApi#renderUrl
         * @description URL Renderer, takes multiple parameters
         * @param {string} endpoint server endpoint, must start and end with '/'
         * @param {Array=} urlParams (Optional) Array with URL params. Are rendered in the same order they come
         * rendered through console output.
         * @return {string} Rendered URL
         * @methodOf trulii.activities.services.LocationServerApi
         */
        function renderUrl(endpoint, urlParams) {
            var hostArr = [serverApi, endpoint];
            var result = urlParams ? hostArr.concat(urlParams.join('/')) : hostArr;
            result = result.join('');
            if (debug) {
                console.log('ServerApi.renderUrl:');
                console.log(result);
            }
            return result;
        }

        return api;
    }

})();