/**
 * @ngdoc service
 * @name trulii.activities.services.ActivityServerApi
 * @description API Service for Activity related Endpoints
 * @requires trulii.routes.serverConf
 */
(function () {
    'use strict';

    angular
        .module('trulii.activities.services')
        .factory('ActivityServerApi', ActivityServerApi);

    ActivityServerApi.$inject = ['serverConf'];

    function ActivityServerApi(serverConf) {

        var serverApi = serverConf.url + '/api/';
//        var apiVersion = 'v1';
        var debug = false;

        //noinspection UnnecessaryLocalVariableJS
        var api = {

            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#activities
             * @description Renders **`/api/activities/`** Activities List URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'activities' : function () {
                return renderUrl('activities/', null);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#search
             * @description Renders **`/api/activities/search`** Activities Search URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'search' : function () {
                return renderUrl('activities/', ['search/']);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#activity
             * @description Renders **`/api/activities/:idActivity`** Activity URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'activity' : function (idActivity) {
                return renderUrl('activities/', [idActivity]);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#gallery
             * @description Renders **`/api/activities/:idActivity/gallery`** Activity gallery URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'gallery' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'gallery']);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#calendars
             * @description Renders **`/api/activities/:idActivity/calendars`** Activity calendars URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'calendars' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'calendars']);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#calendar
             * @description Renders **`/api/activities/:idActivity/calendars/:idCalendar`** Activity calendar URL
             * @param {number} idActivity Activity Id
             * @param {number} idCalendar Calendar Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'calendar' : function (idActivity, idCalendar) {
                return renderUrl('activities/', [idActivity, 'calendars', idCalendar]);
            },
            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#locations
             * @description Renders **`/api/activities/:idActivity/calendars/:idCalendar`** Activity locations URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'locations' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'locations']);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#publish
             * @description Renders **`/api/activities/:idActivity/publish`** Activity publication URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'publish' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'publish']);
            },
            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#unpublish
             * @description Renders **`/api/activities/:idActivity/unpublish`** Activity publication URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'unpublish' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'unpublish']);
            },
            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#info
             * @description Renders **`/api/activities/info`** Activities Information URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'info' : function () {
                return renderUrl('activities/', ['info']);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#categories
             * @description Renders **`/api/activities/categories`** Activities Categories URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'categories' : function () {
                return renderUrl('activities/', ['categories']);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.ActivityServerApi#orders
             * @description Renders **`/api/activities/orders`** Activities Orders URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'orders' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'orders']);
            }
        };

        /**
         * @ngdoc function
         * @name trulii.activities.services.ActivityServerApi#renderUrl
         * @description URL Renderer, takes multiple parameters
         * @param {string} endpoint server endpoint, must start and end with '/'
         * @param {Array=} urlParams (Optional) Array with URL params. Are rendered in the same order they come
         * rendered through console output.
         * @return {string} Rendered URL
         * @methodOf trulii.activities.services.ActivityServerApi
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