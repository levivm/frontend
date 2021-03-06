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
        'Activity', 'LocationManager'];

    function ActivitiesManager($http, $q, ActivityServerApi, OrganizerServerApi, StudentServerApi, Activity, LocationManager) {

        var RECOMMENDED_QTY = 8;
        var api = ActivityServerApi;
        var apiOrg = OrganizerServerApi;
        var apiStudent = StudentServerApi;
        var _pool = {};
        var _activities = [];
        var presave_info = null;
        var categories = null;
        var defaultPageSize = 8;
        var defaultPage = 1;
        var EVENT_DELETE_ACTIVITY='delete-activity';
        //noinspection UnnecessaryLocalVariableJS
        var ActivitiesManager = {

            /**
             * @ngdoc method
             * @name .#getActivities
             * @description Gets all existing activities
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getActivities : getActivities,

            getCategoryActivities: getCategoryActivities,

            /**
             * @ngdoc method
             * @name .#getRecommendedActivities
             * @description Gets recommended activities
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getRecommendedActivities : getRecommendedActivities,

            /**
             * @ngdoc method
             * @name .#getFeaturedActivities
             * @description Gets featured activities
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getFeaturedActivities: getFeaturedActivities,
            
            /**
             * @ngdoc method
             * @name .#getActivity
             * @description Gets or creates a new Activity
             * @param {number} activityId Id of activity to retrieve
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getActivity : getActivity,

            /**
             * @ngdoc method
             * @name .#getOrders
             * @description Gets Orders related to an Activity
             * @param {number} activityId Id of activity to retrieve orders for
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getOrders: getOrders,

            /**
             * @ngdoc method
             * @name .#getStudentActivities
             * @description Gets all of a student's activities
             * @return {promise} Activity Promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            getStudentActivities : getStudentActivities,

            /**
             * @ngdoc method
             * @name .#loadOrganizerActivities
             * @description Gets all of the activities related to an Organizer
             * @param {number} organizerId - Id of organizer for which to retrieve activities
             * @return {array} Organizer Activities
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            loadOrganizerActivities : loadOrganizerActivities,

            /**
             * @ngdoc method
             * @name .#loadGeneralInfo
             * @description Returns general activities related info
             * like `categories`, `levels`, `sub-categories` and `tags`
             * @return {object} Presave Info
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            loadGeneralInfo : loadGeneralInfo,


            getCategory: getCategory,
            
            leadsCategory: leadsCategory,

            /**
             * @ngdoc method
             * @name .#getCategories
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
             * @name .#enroll
             * @description Enrolls a student on the specified activity
             * @param {number} activityId - Id of activity to enroll on
             * @param {boolean} data.is_free - Indicates if the enrollment is free
             * @param {object} data - Contains enrollment info
             * @param {number} data.calendar - Id of calendar
             * @param {number} data.student - Id of student
             * @param {number} data.amount - Total amount of the enrollment action
             * @param {number} data.quantity - Quantity of enrollments
             * @param {number} data.assistants - Number of assistants
             * @param {number} data.last_four_digits - Last credit card four digits
             * @return {promise} Enroll result promise
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            enroll : enroll,
            /**
             * @ngdoc method
             * @name .#enroll
             * @description Update date after like activity
             * @param {object} activityData - Data Activity
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            like : like,
            /**
             * @ngdoc method
             * @name .#deleteActivity
             * @description Delete activity from organizer dashboard
             * @param {number} activityId - Id of acitvity to delte
             * @methodOf trulii.activities.services.ActivitiesManager
             */
            deleteActivity : deleteActivity,




            EVENT_DELETE_ACTIVITY: EVENT_DELETE_ACTIVITY

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

        function getRecommendedActivities(){
            var config = {
                'params': {
                    'o': 'score',
                    'city': LocationManager.getCurrentCity().id,
                    'page_size': RECOMMENDED_QTY
                }
            };
            return $http.get(api.search(), config).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                $q.reject(response.data);
            }
        }

        function getFeaturedActivities(){
          return $http.get(api.featured()).then(success, error);
          function success(response){
              return response.data;
          }
          function error(response){
              $q.reject(response.data);
          }
        }

        function getCategoryActivities(category){
            var config = {
                'params': {
                    'category': category
                }
            };
            return $http.get(api.search(), config).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                $q.reject(response.data);
            }
        }

        function getStudentActivities(studentId, status, page, page_size){
          var params = {};
          if(!page){
            params.page = defaultPage;
          }
          else{
            params.page = page;
          }
          if(!page_size){
            params.page_size = defaultPageSize;
          }
          else{
            params.page_size = page_size;
          }
          if(status){
            params.status = status;
          }
            return $http.get(apiStudent.activities(studentId), {params: params}).then(success, error);

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
            //console.log('get activity', activity);
            if (activity) {
                deferred.resolve(activity);
            } else {
                _load(activityId, deferred);
            }

            return deferred.promise;
        }

        function getOrders(activityId, calendarId){
            return $http.get(api.orders(activityId)).then(success, error);

            function success(response){
                if(calendarId){
                    return response.data.filter(filterByCalendarId);
                } else {
                    return response.data;
                }
            }

            function error(response){
                return response;
            }

            function filterByCalendarId(order){
                return order.calendar === parseInt(calendarId);
            }
        }

        function loadOrganizerActivities(organizerId, status, page, pageSize) {
            if(!page){
              page = 1;
            }
            if(!pageSize){
              pageSize = 8;
            }
            if(!status){
              status = 'open';
            }

            return $http.get(apiOrg.activities(organizerId),
                {params: {
                  page: page,
                  page_size: pageSize,
                  status: status
                }})
                .then(function (response) {
                  return response.data;
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
            return deferred.promise;
        }

        function getCategory(categoryId){
            return $http.get(api.categories(categoryId)).then(function (response) {
                return response;
            });

        }
        
        function leadsCategory(category, email) {
            
            return $http.post(api.leads(category.slug), {'category': category.id, 'email': email}).then(success,error);

            function success(response){
                return response.data;
            }
            function error(response){
                return $q.reject(response);
            }
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
                return [];
            }
            return $http.get(api.subcategoryCovers(subcategoryId)).then(success, error);

            function success(response){
                return response.data.pictures;
            }
            function error(response){
                return [];
            }
        }

        function enroll(activityId, data) {
            return $http.post(api.orders(activityId), data).then(success,error);

            function success(response){
                return response.data;
            }
            function error(response){
                return $q.reject(response);
            }
        }

        function like(activityID, likeValue){
            var instance = _pool[activityID];

            if(instance)
               instance.wish_list = likeValue;

        }

        function deleteActivity(activityID){
          return $http.delete(api.activity(activityID)).then(success,error);

          function success(response){
              return response.data;
          }
          function error(response){
              return $q.reject(response);
          }
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

        function _getOrganizerActivitiesById(organizerId){
            return _activities[organizerId];
        }

    }

})();
