/**
 * @ngdoc service
 * @name trulii.students.services.StudentServerApi
 * @description API Service for Student related Endpoints
 * @requires trulii.routes.serverConf
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.services')
        .factory('StudentServerApi', StudentServerApi);

    StudentServerApi.$inject = ['serverConf'];

    function StudentServerApi(serverConf) {

        var serverApi = serverConf.url + '/api/';
//        var apiVersion = 'v1';
        var debug = false;

        //noinspection UnnecessaryLocalVariableJS
        var api = {

            /**
             * @ngdoc function
             * @name trulii.students.services.StudentServerApi#student
             * @description Renders **`/api/students/:idStudent`** Student URL
             * @param {number} idStudent Student Id
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'student': function (idStudent){
                return renderUrl('students/', [idStudent]);
            },

            /**
             * @ngdoc function
             * @name trulii.students.services.StudentServerApi#upload_photo
             * @description Renders **`/api/users/upload/photo`** Picture Upload URL
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'upload_photo': function (){
                return renderUrl('users/', ['upload', 'photo/']);
            },

            /**
             * @ngdoc function
             * @name trulii.students.services.StudentServerApi#activities
             * @description Renders **`/api/students/:idStudent/activities`** Activity List URL
             * @param {number} idStudent Student Id
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'activities': function(idStudent){
                return renderUrl('students/', [idStudent, 'activities/']);
            },

            /**
             * @ngdoc function
             * @name trulii.students.services.StudentServerApi#autocomplete
             * @description Renders **`/api/students/:idStudent/activities/autocomplete`** Signed up Activity List URL
             * @param {number} idStudent Student Id
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'autocomplete': function(idStudent){
              return renderUrl('students/', [idStudent, 'activities/autocomplete/']);
            },

            /**
             * @ngdoc function
             * @name trulii.students.services.StudentServerApi#reviews
             * @description Renders **`/api/students/:idStudent/reviews/`** Reviews List URL
             * @param {number} idStudent Student Id
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'reviews': function(idStudent){
                return renderUrl('students/', [idStudent, 'reviews/']);
            },

            /**
             * @ngdoc function
             * @name trulii.students.services.StudentServerApi#orders
             * @description Renders **`/api/students/:idStudent/orders`** Order List URL
             * @param {number} idStudent Student Id
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'orders': function(idStudent){
                return renderUrl('students/', [idStudent, 'orders/']);
            },

            /**
             * @ngdoc function
             * @name .#order
             * @description Renders **`/api/students/:idStudent/orders/:idOrder`** Order URL
             * @param {number} idStudent Student Id
             * @param {number} idOrder Order Id
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'order': function(idStudent, idOrder){
                return renderUrl('orders/', [idOrder]);
            },
            /**
             * @ngdoc function
             * @name .#messages
             * @description Renders **`/api/messages`**
             * Student Messages URL
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'messages': function (){
                return renderUrl('messages/');
            },
            
            /**
             * @ngdoc function
             * @name .#message
             * @description Renders **`/api/messages/:idMessage`**
             * Organizer Message URL
             * @param {number} idMessage Message Id
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'message': function(idMessage){
              return renderUrl('messages/', [idMessage]);
            },
            
            'readMessage': function(idMessage){
              return renderUrl('messages/', [idMessage, 'read/'])
            },

            /**
             * @ngdoc function
             * @name .#refunds
             * @description Renders **`/api/students/wish_list/`** Refund URL
             * @return {string} Rendered URL
             * @methodOf trulii.students.services.StudentServerApi
             */
            'wishList': function(){
                return renderUrl('students/', ['wish_list/']);
            },


        };

        /**
         * @ngdoc function
         * @name trulii.students.services.StudentServerApi#renderUrl
         * @description URL Renderer, takes multiple parameters
         * @param {string} endpoint Server endpoint, must end with '/'
         * @param {Array=} urlParams (Optional) Array with URL params. Are rendered in the same order they come
         * rendered through console output.
         * @return {string} Rendered URL
         * @methodOf trulii.students.services.StudentServerApi
         */
        function renderUrl(endpoint, urlParams){
            var hostArr = [serverApi, endpoint];
            var result = urlParams? hostArr.concat(urlParams.join('/')) : hostArr;
            result = result.join('');
            return result;
        }

        for (var key in api){
            if(api.hasOwnProperty(key)) api[key](1, 1);
        }

        return api;
    }

})();
