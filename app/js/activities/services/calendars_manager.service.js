/**
 * @ngdoc service
 * @name trulii.activities.services.CalendarsManager
 * @description CalendarsManager
 * @requires ng.$http
 * @requires ng.$q
 * @requires ng.$filter
 * @requires trulii.activities.services.ActivityServerApi
 * @requires trulii.activities.services.Calendar
 */

(function () {
    'use strict';
    angular
        .module('trulii.activities.services')
        .factory('CalendarsManager', CalendarsManager);

    CalendarsManager.$inject = ['$http', '$q','$timeout', 'ActivityServerApi', 'Calendar', '$filter'];

    function CalendarsManager($http, $q, $timeout, ActivityServerApi, Calendar, $filter) {

        var api = ActivityServerApi;
        var _pool = {};
        var calendars = [];

        //noinspection UnnecessaryLocalVariableJS
        var CalendarsManager = {

            calendars: calendars,

            /**
             * @ngdoc function
             * @name .#deleteCalendar
             * @description Deletes a Calendar from an Activity
             * @param {number} calendarId Id of the Calendar to delete
             * @methodOf trulii.activities.services.CalendarsManager
             */
            deleteCalendar: deleteCalendar,

            /**
             * @ngdoc function
             * @name .#deleteCalendar
             * @description Retrieves a Calendar instance from an Activity
             * @param {number} calendarId Id of the Calendar to retrieve
             * @methodOf trulii.activities.services.CalendarsManager
             */
            getCalendar: getCalendar,

            /**
             * @ngdoc function
             * @name .#fetchCalendar
             * @description Retrieves a Calendar from an Activity directly from server
             * @param {number} calendarId Id of the Calendar to retrieve
             * @methodOf trulii.activities.services.CalendarsManager
             */
            fetchCalendar: fetchCalendar,

            /**
             * @ngdoc function
             * @name .#fetchCalendar
             * @description Retrieves a Calendar from an Activity directly from server
             * @param {number} activityId Id of the Activity to get calendars from
             * @methodOf trulii.activities.services.CalendarsManager
             */
            loadCalendars: loadCalendars,

            /**
             * @ngdoc function
             * @name .#setCalendar
             * @description Sets a Calendar
             * @param {object} calendarData calendar data to extend to calendar instance
             * @methodOf trulii.activities.services.CalendarsManager
             */
            setCalendar: setCalendar
        };

        return CalendarsManager;

        //--------- Exposed Functions ---------//

        function deleteCalendar(calendar) {
            var deferred = $q.defer();
            var activityId = calendar.activity;

            $http.delete(api.calendar(activityId, calendar.id)).then(success, error);

            return deferred.promise;

            function success() {
                _deleteInstance(calendar.id);
                deferred.resolve(calendars[activityId]);
            }
            function error(response) {
                deferred.reject(response.data);
            }
        }

        function getCalendar(calendarId,activityId) {
            var deferred = $q.defer();
            var calendar = new Calendar();

            angular.extend(calendar, _retrieveInstance(calendarId,null,activityId));
            deferred.resolve(calendar);

            return deferred.promise;
        }

        function fetchCalendar(activityId, calendarId) {
            var deferred = $q.defer();
            $http.get(api.calendar(activityId, calendarId)).then(success, error);
            return deferred.promise;

            function success(response) {
                var result = response.data;
                var calendar = _retrieveInstance(result.id, result);
                deferred.resolve(calendar);
            }

            function error(response) {
                var result = response.data;
                deferred.reject(result);
            }
        }

        function loadCalendars(activityId) {
            var deferred = $q.defer();
            if (calendars[activityId] && calendars[activityId].length > 0)
                deferred.resolve(calendars[activityId]);
            else
                $http.get(api.calendars(activityId)).then(success, error);

            return deferred.promise;

            function success(response) {
                //Init calendars[activityId] if does not exists
                if(!calendars[activityId]) {calendars[activityId] = [];}

                _setCalendars(response.data);

                deferred.resolve(calendars[activityId]);
            }

            function error(response) {
                deferred.reject(response.data);
            }
        }

        function setCalendar(calendarData) {
            var calendar = _getCalendarById(calendarData.id);
            if (calendar){
                calendar.setData(calendarData);
            } else {
                calendar = _retrieveInstance(calendarData.id, calendarData,calendarData.activity);
                _addCalendar(calendar);
                _orderCalendars(calendar.activity);


            }

            return calendar;
        }

        //--------- Internal Functions ---------//

        function _retrieveInstance(calendarId, calendarData, activityId) {
            var instance = _getCalendarById(calendarId);
            // if calendar does not exist, create new one using calendarData
            if (!instance){
                instance = new Calendar(calendarData);
                instance.activity = activityId;
            } else {
                // if calendar exists and calendarData is not NULL, update the calendar
                if(calendarData){ instance.setData(calendarData); }
            }

            return instance;
        }

        function _getCalendarById(calendarId) {
            return _pool[calendarId];
        }

        function _deleteInstance(calendarId) {
            var instance = _getCalendarById(calendarId);
            if (instance){
                angular.forEach(calendars[instance.activity], function (calendar, index) {
                    if (calendar.id == instance.id){ calendars[instance.activity].splice(index, 1); }
                });
                delete _pool[calendarId];
            }
        }
        function _setCalendars(calendarsData) {
            // calendars = [];
            angular.forEach(calendarsData, function (calendarData) {
                var calendar = new Calendar(calendarData);
                _addCalendar(calendar);
            });
        }

        function _addCalendar(calendar) {
            _pool[calendar.id] = calendar;
            calendars[calendar.activity].push(calendar);
        }

        function _orderCalendars(activityId){
            calendars[activityId] = $filter('orderBy')(calendars[activityId], 'initial_date');
        }
    }

})();
