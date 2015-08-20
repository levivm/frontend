/**
 * @ngdoc service
 * @name trulii.landing.services.LandingServerApi
 * @description API Service for Landing related Endpoints
 * @requires trulii.routes.serverConf
 */
(function () {
    'use strict';

    angular
        .module('trulii.landing.services')
        .factory('LandingServerApi', LandingServerApi);

    LandingServerApi.$inject = ['serverConf'];

    function LandingServerApi(serverConf) {

        var serverApi = serverConf.url + '/api/';
//        var apiVersion = 'v1';
        var debug = false;

        //noinspection UnnecessaryLocalVariableJS
        var api = {

            /**
             * @ngdoc function
             * @name trulii.landing.services.landingServerApi#contactUs
             * @description Renders **`/api/contact-us/`** Contact Us URL
             * @return {string} Rendered URL
             * @methodOf trulii.landing.services.LandingServerApi
             */
            'contactUs' : function () {
                return renderUrl('contact-us/', null);
            }
        };

        /**
         * @ngdoc function
         * @name trulii.landing.services.LandingServerApi#renderUrl
         * @description URL Renderer, takes multiple parameters
         * @param {string} endpoint server endpoint, must start and end with '/'
         * @param {Array=} urlParams (Optional) Array with URL params. Are rendered in the same order they come
         * rendered through console output.
         * @return {string} Rendered URL
         * @methodOf trulii.landing.services.LandingServerApi
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