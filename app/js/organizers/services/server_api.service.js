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
             * @name .#activities
             * @description Renders **`/api/organizers/:idOrganizer/activities`** Activities List URL
             * @param {number} idOrganizer Organizer Id
             * @return {string} Rendered URL
             * @methodOf trulii.organizers.services.OrganizerServerApi
             */
            'activities': function(idOrganizer){
                return renderUrl('organizers/', [idOrganizer, 'activities']);
            },

            /**
             * @ngdoc function
             * @name .#locations
             * @description Renders **`/api/organizers/:idOrganizer/locations`** Locations URL
             * @param {number} idOrganizer Organizer Id
             * @return {string} Rendered URL
             * @methodOf trulii.organizers.services.OrganizerServerApi
             */
            'locations': function(idOrganizer){
                return renderUrl('organizers/', [idOrganizer, 'locations']);
            },

            /**
             * @ngdoc function
             * @name .#organizer
             * @description Renders **`/api/organizers/:idOrganizer`** Organizer URL
             * @param {number} idOrganizer Organizer Id
             * @return {string} Rendered URL
             * @methodOf trulii.organizers.services.OrganizerServerApi
             */
            'organizer': function (idOrganizer){
                return renderUrl('organizers/', [idOrganizer]);
            },

            /**
             * @ngdoc function
             * @name .#instructors
             * @description Renders **`/api/organizers/:idOrganizer/instructors`** Organizer Instructors URL
             * @param {number} idOrganizer Organizer Id
             * @return {string} Rendered URL
             * @methodOf trulii.organizers.services.OrganizerServerApi
             */
            'instructors' : function (idOrganizer) {
                return renderUrl('organizers/', [idOrganizer, 'instructors']);
            },

            /**
             * @ngdoc function
             * @name .#instructor
             * @description Renders **`/api/instructors/:idInstructor`**
             * Organizer Instructor URL
             * @param {number} idInstructor Instructor Id
             * @return {string} Rendered URL
             * @methodOf trulii.organizers.services.OrganizerServerApi
             */
            'instructor': function (idInstructor){
                return renderUrl('instructors/', [idInstructor]);
            }
        };

        /**
         * @ngdoc function
         * @name .#renderUrl
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
                console.log('OrganizerServerApi.renderUrl:');
                console.log(result);
            }
            return result;
        }

        for (var key in api){
            if(api.hasOwnProperty(key)) api[key](1, 1);
        }

        return api;
    }

})();