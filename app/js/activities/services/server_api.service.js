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
             * @name .#activities
             * @description Renders **`/api/activities/`** Activities List URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'activities' : function () {
                return renderUrl('activities/', null);
            },

            /**
             * @ngdoc function
             * @name .#search
             * @description Renders **`/api/activities/search`** Activities Search URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'search' : function () {
                return renderUrl('activities/', ['search/']);
            },

            /**
             * @ngdoc function
             * @name .#share
             * @description Renders **`/api/activities/search`** Activitiy Share URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'share' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'share/']);
            },

            /**
             * @ngdoc function
             * @name .#activity
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
             * @name .#reviews
             * @description Renders **`/api/activities/:idActivity/reviews`** Activity Reviews URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'reviews' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'reviews/']);
            },

            /**
             * @ngdoc function
             * @name .#builtReviews
             * @description Renders **`/api/activities/:idActivity/reviews/built`** Activity Reviews URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'builtReviews' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'reviews', 'built/']);
            },

            /**
             * @ngdoc function
             * @name .#review
             * @description Renders **`/api/reviews/:idReview`** Review URL
             * @param {number} idReview Review Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'review' : function (idReview) {
                return renderUrl('reviews/', [idReview]);
            },

            /**
             * @ngdoc function
             * @name .#report
             * @description Renders **`/api/reviews/:idReview/report`** Report Review URL
             * @param {number} idReview Review Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'report' : function (idReview) {
                return renderUrl('reviews/', [idReview, 'report/']);
            },

            /**
             * @ngdoc function
             * @name .#read
             * @description Renders **`/api/reviews/:idReview/read`** Mark as Read Review URL
             * @param {number} idReview Review Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'read' : function (idReview) {
                return renderUrl('reviews/', [idReview, 'read/']);
            },

            /**
             * @ngdoc function
             * @name .#featured
             * @description Renders **`/api/activities/featured`** Get Featured Activities URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'featured' : function(){
              return renderUrl( 'activities/featured');
            },

            /**
             * @ngdoc function
             * @name .#gallery
             * @description Renders **`/api/activities/:idActivity/gallery{=/auto}`** Activity gallery URL
             * @param {number} idActivity Activity Id
             * @param {boolean} from_stock Indicates wether to use a stock photo or not
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'gallery' : function (idActivity, from_stock) {
                if(from_stock)
                    return renderUrl('activities/', [idActivity, 'gallery','auto']);
                else
                    return renderUrl('activities/', [idActivity, 'gallery']);
            },

            /**
             * @ngdoc function
             * @name .#galleryCover
             * @description Renders **`/api/activities/:idActivity/gallery/cover`** Activity gallery cover URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'galleryCover' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'gallery', 'cover']);
            },

            /**
             * @ngdoc function
             * @name .#galleryPicture
             * @description Renders **`/api/activities/:idActivity/gallery/:idPicture`** Activity gallery picture URL
             * @param {number} idActivity Activity Id
             * @param {number} idPicture Picture Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'galleryPicture' : function (idActivity, idPicture) {
                    return renderUrl('activities/', [idActivity, 'gallery', idPicture]);
            },

            /**
             * @ngdoc function
             * @name .#calendars
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
             * @name .#calendar
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
             * @name .#locations
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
             * @name .#publish
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
             * @name .#unpublish
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
             * @name .#info
             * @description Renders **`/api/activities/info`** Activities Information URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'info' : function () {
                return renderUrl('activities/', ['info']);
            },

            /**
             * @ngdoc function
             * @name .#categories
             * @description Renders **`/api/activities/categories`** Activities Categories URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'categories' : function (idCategory) {
                if(idCategory)
                    return renderUrl('activities/', ['categories', idCategory]);
                else
                    return renderUrl('activities/', ['categories']);
            },

            /**
             * @ngdoc function
             * @name .#subcategoryCovers
             * @description Renders **`/api/activities/subcategories/:idSubcategory/covers/`** Activities Categories URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'subcategoryCovers' : function (subcategoryId) {
                return renderUrl('activities/', ['subcategories', subcategoryId, 'covers/']);
            },
            
             /**
             * @ngdoc function
             * @name .#leads
             * @description Renders **`/api/categories/:slug/leads/`** Email leads
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'leads' : function (category) {
                return renderUrl('activities/', ['categories', category, 'leads/']);
            },

            /**
             * @ngdoc function
             * @name .#orders
             * @description Renders **`/api/activities/:idActivity/orders`** Activities Orders URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'orders' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'orders']);
            },
            /**
             * @ngdoc function
             * @name .#order
             * @description Renders **`/api/orders/:idOrder`** Order URL
             * @param {number} idOrder Order Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'order': function(idOrder){
                return renderUrl('orders/', [idOrder]);
            },

            /**
             * @ngdoc function
             * @name .#instructors
             * @description Renders **`/api/activities/:idActivity/instructors`** Activity Instructors URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'instructors' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'instructors']);
            },

            /**
             * @ngdoc function
             * @name .#instructor
             * @description Renders **`/api/activities/:idActivity/instructors/:idInstructor`** Activity Instructor URL
             * @param {number} idActivity Activity Id
             * @param {number} idInstructor Instructor Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'instructor' : function (idActivity, idInstructor) {
                return renderUrl('activities/', [idActivity, 'instructors', idInstructor]);
            },


            /**
             * @ngdoc function
             * @name .#autocomplete
             * @description Renders **`/api/activities/autocomplete`** Activity Instructor URL
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'autocomplete' : function () {
                return renderUrl('activities/', ['autocomplete']);
            },

            /**
             * @ngdoc function
             * @name .#messages
             * @description Renders **`/api/messages/:idActivity`**
             * Activity Messages URL
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'messages': function (){
                return renderUrl('messages/');
            },

            /**
             * @ngdoc function
             * @name .#message
             * @description Renders **`/api/messages/:idMessage`**
             * Activity Message URL
             * @param {number} idMessage Message Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'message': function(idMessage){
              return renderUrl('messages/', [idMessage]);
            },

            /**
             * @ngdoc function
             * @name .#stats
             * @description Renders **`/api/activities/:idActivity/stats`** Activity Stats
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'stats' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'stats']);
            },

            /**
             * @ngdoc function
             * @name .#counter
             * @description Renders **`/api/activities/:idActivity/views_counter`** Activity Counter
             * @param {number} idActivity Activity Id
             * @return {string} Rendered URL
             * @methodOf trulii.activities.services.ActivityServerApi
             */
            'viewsCounter' : function (idActivity) {
                return renderUrl('activities/', [idActivity, 'views_counter']);
            }

        };

        /**
         * @ngdoc function
         * @name .#renderUrl
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
