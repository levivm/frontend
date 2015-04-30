/**
 * @ngdoc service
 * @name trulii.organizers.services.OrganizerServerApi
 * @description API Service for Organizer related Endpoints
 * @requires trulii.routes.serverConf
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.services')
        .factory('OrganizerServerApi', OrganizerServerApi);

    OrganizerServerApi.$inject = ['serverConf'];

    function OrganizerServerApi(serverConf) {

        var serverApi = serverConf.url + '/api/';
//        var apiVersion = 'v1';
        var debug = false;

        //noinspection UnnecessaryLocalVariableJS
        var api = {

            /**
             * @ngdoc function
             * @name trulii.organizers.services.OrganizerServerApi#activities
             * @description Renders **`/api/organizers/:idOrganizer/activities`** Activities List URL
             * @return {string} Rendered URL
             * @methodOf trulii.organizers.services.OrganizerServerApi
             */
            'activities': function(idOrganizer){
                return renderUrl('organizers/', [idOrganizer, 'activities']);
            }
        };

        /**
         * @ngdoc function
         * @name trulii.organizers.services.OrganizerServerApi#renderUrl
         * @description URL Renderer, takes multiple parameters
         * @param {string} endpoint Server endpoint, must end with '/'
         * @param {Array=} urlParams (Optional) Array with URL params. Are rendered in the same order they come
         * rendered through console output.
         * @return {string} Rendered URL
         * @methodOf trulii.organizers.services.OrganizerServerApi
         */
        function renderUrl(endpoint, urlParams){
            var hostArr = [serverApi, endpoint];
            var result = urlParams? hostArr.concat(urlParams.join('/')) : hostArr;
            result = result.join('');
            if(debug){
                console.log('ServerApi.renderUrl:');
                console.log(result);
            }
            return result;
        }

        return api;
    }

})();