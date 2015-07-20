/**
 * @ngdoc service
 * @name trulii.activities.services.ActivitiesManager
 * @description ActivitiesManager
 * @requires ng.$http
 * @requires ng.$q
 * @requires trulii.activities.services.ActivityServerApi
 * @requires trulii.organizers.services.OrganizerServerApi
 * @requires trulii.activities.services.Activity
 * @requires trulii.activities.services.CalendarsManager
 */

(function () {
    'use strict';
    angular
        .module('trulii.activities.services')
        .factory('ActivitiesManager', ActivitiesManager);

    ActivitiesManager.$inject = ['$http', '$q', 'ActivityServerApi', 'OrganizerServerApi', 'StudentServerApi',
        'Activity', 'CalendarsManager'];

    function ActivitiesManager($http, $q, ActivityServerApi, OrganizerServerApi, StudentServerApi, Activity, CalendarsManager) {

        var api = ActivityServerApi;
        var apiOrg = OrganizerServerApi;
        var apiStudent = StudentServerApi;
        var _pool = {};
        var _activities = [];
        var presave_info = null;

        var KEY_SEARCH_QUERY = 'q';
        var KEY_SEARCH_CITY = 'city';
        var KEY_SEARCH_CATEGORY = 'category';
        var KEY_SEARCH_SUBCATEGORY = 'subcategory';
        var KEY_SEARCH_DATE = 'date';

        //noinspection UnnecessaryLocalVariableJS
        var ActivitiesManager = {

            /**
             * @ngdoc method
             * @name trulii.activities.services.ActivitiesManager#getActivities
             * @description Gets all existing activities
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getActivities : getActivities,

            /**
             * @ngdoc method
             * @name trulii.activities.services.ActivitiesManager#searchActivities
             * @description Searches activities with provided search parameters
             * @param {string} q query string
             * @param {number} cityId Id of the city where to search for activities
             * @param {number=} categoryId Id of the category where to search for activities
             * @param {number=} subcategoryId Id of the subcategory where to search for activities
             * @param {number=} date Date in Unix Timestamp format from where to search for activities
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            searchActivities : searchActivities,

            /**
             * @ngdoc method
             * @name trulii.activities.services.ActivitiesManager#getActivity
             * @description Gets or creates a new Activity
             * @param {number} activityId Id of activity to retrieve
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getActivity : getActivity,

            /**
             * @ngdoc method
             * @name trulii.activities.services.ActivitiesManager#getStudentActivities
             * @description Gets all of a student's activities
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getStudentActivities : getStudentActivities,

            /**
             * @ngdoc method
             * @name trulii.activities.services.ActivitiesManager#loadOrganizerActivities
             * @description Gets all of the activities related to an Organizer
             * @param {number} organizerId - Id of organizer for which to retrieve activities
             * @return {array} Organizer Activities
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            loadOrganizerActivities : loadOrganizerActivities,

            /**
             * @ngdoc method
             * @name trulii.activities.services.ActivitiesManager#loadGeneralInfo
             * @description Returns general activities related info
             * like `categories`, `levels`, `sub-categories` and `tags`
             * @return {object} Presave Info
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            loadGeneralInfo : loadGeneralInfo,

            /**
             * @ngdoc method
             * @name trulii.activities.services.ActivitiesManager#enroll
             * @description Enrolls a student on the specified activity
             * @param {number} activityId - Id of activity to enroll on
             * @param {object} data - Contains enrollment info
             * @param {number} data.chronogram - Id of calendar
             * @param {number} data.student - Id of student
             * @param {number} data.amount - Total amount of the enrollment action
             * @param {number} data.quantity - Quantity of enrollments
             * @param {number} data.assistants - Number of assistants
             * @return {promise} Enroll result promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            enroll : enroll
        };

        return ActivitiesManager;

        /***************** Function definitions ********************/

        function getActivities(){
            return $http.get(api.activities()).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                $q.reject(response.data);
            }
        }

        function searchActivities(q, cityId, categoryId, subcategoryId, date){
            var deferred = $q.defer();
            var requestConfig;

            if(!cityId){
             deferred.reject(null);
            }

            requestConfig = {
                'params': {
                    KEY_SEARCH_QUERY: q,
                    KEY_SEARCH_CITY: cityId
                }
            };

            // If category is orivded
            if(categoryId){ requestConfig.params[KEY_SEARCH_CATEGORY] = categoryId; }

            // If subcategory is provided
            if(subcategoryId){ requestConfig.params[KEY_SEARCH_SUBCATEGORY] = subcategoryId;}

            // If date is provided
            if(date){ requestConfig.params[KEY_SEARCH_DATE] = date; }

            $http.get(api.search(), requestConfig).then(success, error);

            return deferred.promise;


            function success(response){
                console.log(response);
                deferred.resolve(response);
            }
            function error(response){
                deferred.reject(response);
            }
        }

        function getStudentActivities(studentId){
            return $http.get(apiStudent.activities(studentId)).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                $q.reject(response.data);
            }
        }

        function getActivity(activityId) {
            var deferred = $q.defer();
            var activity = _search(activityId);

            if (activity) {
                deferred.resolve(activity);
            } else {
                _load(activityId, deferred);
            }

            return deferred.promise;
        }

        function loadOrganizerActivities(organizerId) {

            if (!(_.isEmpty(_activities))) {
                return _activities;
            }

            return $http.get(apiOrg.activities(organizerId))
                .then(function (response) {
                    _.each(response.data, function (activityData) {
                        var activity = _retrieveInstance(activityData.id, activityData);
                        _activities.push(activity)
                    });
                    return _activities;
                });
        }

        function loadGeneralInfo() {
            var deferred = $q.defer();

            if (presave_info) {
                deferred.resolve(presave_info);
            } else {
                $http.get(api.info()).then(function (response) {
                    presave_info = response.data;
                    deferred.resolve(presave_info);
                });
            }
            return deferred.promise
        }

        function enroll(activityId, data) {
            return $http.post(api.orders(activityId), data);
        }

        function _retrieveInstance(activityID, activityData) {
            var instance = _pool[activityID];


            if (instance) {
                instance.setData(activityData);
            } else {
                instance = new Activity(activityData);

                _pool[activityID] = instance;
            }

            return instance;
        }

        function _search(activityID) {
            return _pool[activityID];
        }

        function _load(activityID, deferred) {
            if (activityID) {
                $http.get(api.activity(activityID))
                    .then(function (response) {
                        var activityData = response.data;
                        var activity = _retrieveInstance(activityData.id, activityData);
                        deferred.resolve(activity);
                    }, function () {
                        deferred.reject();
                    });
            } else {

                var activity = _retrieveInstance(null, {});

                deferred.resolve(activity);
            }

            return deferred.promise
        }

    }

})();