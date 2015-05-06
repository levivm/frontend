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
            getActivity : getActivity,
            loadOrganizerActivities : loadOrganizerActivities,
            loadGeneralInfo : loadGeneralInfo,
            enroll : enroll
        };

        return ActivitiesManager;

        /***************** Function definitions ********************/

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
                //_base_url + activityID
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

        function getActivity(activityId, create) {
            var deferred = $q.defer();
            var activity = _search(activityId);
            if (activity) {
                deferred.resolve(activity);
            } else {
                _load(activityId, deferred);
            }
            return deferred.promise;
        }

        function loadOrganizerActivities(organizer_id) {

            if (!(_.isEmpty(_activities))) {
                return _activities;
            }

            // serverConf.url+'/api/organizers/'+organizer_id+'/activities/'
            return $http.get(apiOrg.activities(organizer_id))
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

        function enroll(activity_id, data) {
            // serverConf.url+'/api/activities/'+activity_id+'/orders'
            return $http.post(api.orders(activity_id), data);
        }

    }

})();