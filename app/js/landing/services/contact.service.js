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
                console.log("response,data topic",response);
                return response.data.map(mapTopics);
            }

            function error(response){
                console.log("Couldn't get topics from server. response data:", response.data);
                $q.reject(response.data);
            }

            function mapTopics(topic, index){
                var key = Object.keys(topic)[0];
                console.log("TOPPICCC",topic);
                console.log("TOPPICCC",topic[key]);
                var topicObj = {
                    'id': index,
                    'title': key,
                    'subtopics': topic[key].map(mapSubtopic)
                };
                console.groupEnd();

                return topicObj;
            }

            function mapSubtopic(subtopic, index){
                return {
                    'id': index,
                    'title': subtopic
                };
            }
        }

        function sendContactForm(data){
            return $http.post(api.contactUs(), data);
        }
    }

})();