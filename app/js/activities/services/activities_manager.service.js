/**
 * @ngdoc service
 * @name trulii.activities.services.ActivitiesManager
 * @description ActivitiesManager
 * @requires ng.$http
 * @requires ng.$q
 * @requires trulii.activities.services.ActivityServerApi
 * @requires trulii.organizers.services.OrganizerServerApi
 * @requires trulii.students.services.StudentServerApi
 * @requires trulii.activities.services.Activity
 */

(function () {
    'use strict';
    angular
        .module('trulii.activities.services')
        .factory('ActivitiesManager', ActivitiesManager);

    ActivitiesManager.$inject = ['$http', '$q', 'ActivityServerApi', 'OrganizerServerApi', 'StudentServerApi',
        'Activity'];

    function ActivitiesManager($http, $q, ActivityServerApi, OrganizerServerApi, StudentServerApi, Activity) {

        var api = ActivityServerApi;
        var apiOrg = OrganizerServerApi;
        var apiStudent = StudentServerApi;
        var _pool = {};
        var _activities = [];
        var presave_info = null;
        var categories = null;

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
             * @name trulii.activities.services.ActivitiesManager#getOrders
             * @description Gets Orders related to an Activity
             * @param {number} activityId Id of activity to retrieve orders for
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getOrders: getOrders,

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
             * @name trulii.activities.services.ActivitiesManager#getCategories
             * @description Returns activities categories with subcategories
             * @return {array} Categories array
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getCategories : getCategories,

            /**
             * @ngdoc method
             * @name .#getSubcategoryCovers
             * @description Returns activity subcategory covers
             * @return {array} Covers array
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getSubcategoryCovers: getSubcategoryCovers,

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
             * @param {number} data.last_four_digits - Last credit card four digits
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

        function getOrders(activityId){
            return $http.get(api.orders(activityId)).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                return response;
            }
        }

        function loadOrganizerActivities(organizerId) {
            var deferred = $q.defer();

            if (!(_.isEmpty(_activities))) {
                // console.log("DEVOLVIENDO ACTIVIDADES",_activities);
                deferred.resolve(_activities);
            }

            $http.get(apiOrg.activities(organizerId))
                .then(function (response) {
                    _.each(response.data, function (activityData) {
                        var activity = _retrieveInstance(activityData.id, activityData);
                        _activities = [];
                        _activities.push(activity);
                    });
                    deferred.resolve(_activities);
                });

            return deferred.promise;
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
            return deferred.promise;
        }

        function getCategories(){
            var deferred = $q.defer();

            if (presave_info) {
                deferred.resolve(categories);
            } else {
                $http.get(api.categories()).then(function (response) {
                    categories = response.data;
                    deferred.resolve(categories);
                });
            }
            return deferred.promise;
        }

        function getSubcategoryCovers(subcategoryId){
            if(subcategoryId === null){
                console.log('ActivitiesManager.getSubcategoryCovers. subcategoryId not valid:');
                return [];
            }
            return $http.get(api.subcategoryCovers(subcategoryId)).then(success, error);

            function success(response){
                return response.data.pictures;
            }
            function error(response){
                console.log('Error retrieving Cover Pool for subcategory:', subcategoryId, '.', response);
                return [];
            }
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
