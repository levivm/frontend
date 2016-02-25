/**
 * @ngdoc service
 * @name trulii.landing.services.Contact
 * @description Contact Service
 * @requires ng.$http
 * @requires ng.$q
 */
(function () {
    'use strict';

    angular
        .module('trulii.landing.services')
        .factory('Contact', Contact);

    Contact.$inject = ['$http', '$q', 'LandingServerApi'];

    function Contact($http, $q, LandingServerApi) {

        var api = LandingServerApi;

        //noinspection UnnecessaryLocalVariableJS
        var service = {

            getTopics: getTopics,

            sendContactForm: sendContactForm
        };

        return service;

        function getTopics(){
            return $http.get(api.contactUs()).then(success, error);

            function success(response){
                var topics = response.data.map(mapTopics);
                return topics;
            }

            function error(response){
                console.log("Couldn't get topics from server. response data:", response.data);
                $q.reject(response.data);
            }

            function mapTopics(topic){
                var topicObj = {
                    'id': topic.topic_id,
                    'title': topic.topic_label
                };

                return topicObj;
            }
        }

        function sendContactForm(data){
            return $http.post(api.contactUs(), data);
        }
    }

})();
