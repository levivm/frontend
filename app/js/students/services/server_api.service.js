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
            }

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
            if(debug){
                console.log('StudentServerApi.renderUrl:');
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
