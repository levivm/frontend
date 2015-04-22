/**
 * @ngdoc service
 * @name trulii.organizers.services.OrganizerServerApi
 * @description Manager for Organizer related API Endpoints
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
        var debug = true;

        //noinspection UnnecessaryLocalVariableJS
        var api = {

            /**
             * @ngdoc function
             * @name trulii.organizers.services.ActivityServerApi#activities
             * @description Renders "/api/activities/" Activities List URL
             * @return {string} Rendered URL
             * @methodOf trulii.organizers.services.ActivityServerApi
             */
            'activities': function(idOrganizer){
                return renderUrl('organizers/', [idOrganizer, 'activities']);
            }
        };

        /**
         * @ngdoc function
         * @name trulii.organizers.services.ActivityServerApi#renderUrl
         * @description URL Renderer, takes multiple parameters
         * @param {string} endpoint server endpoint, must start and end with '/'
         * @param {Array} urlParams (Optional) Array with URL params. Are rendered in the same order they come
         * rendered through console output.
         * @methodOf trulii.organizers.services.ActivityServerApi
         */
        function renderUrl(endpoint, urlParams){
            var hostArr = [serverApi, endpoint];
            var result = urlParams? hostArr.concat(urlParams.join('/')) : hostArr;
            result = result.join('');
            if(debug){
                console.log('Domain.renderUrl:');
                console.log(result);
            }
            return result;
        }

        return api;
    }

})();