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

    ActivitiesManager.$inject = ['$http', '$q', 'ActivityServerApi', 'OrganizerServerApi',
        'Activity', 'CalendarsManager'];

    function ActivitiesManager($http, $q, ActivityServerApi, OrganizerServerApi, Activity, CalendarsManager) {

        var api = ActivityServerApi;
        var apiOrg = OrganizerServerApi;
        var _pool = {};
        var _activities = [];
        var presave_info = null;

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
             * @name trulii.activities.services.ActivitiesManager#getActivity
             * @description Gets or creates a new Activity
             * @param {number} activityId Id of activity to retrieve
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getActivity : getActivity,

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