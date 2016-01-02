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

    CalendarsManager.$inject = ['$http', '$q', 'ActivityServerApi', 'Calendar'];

    function CalendarsManager($http, $q, ActivityServerApi, Calendar) {

        var api = ActivityServerApi;
        var _pool = {};
        var calendars = [];
        var activityId = null;

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
             * @param {boolean} active flag
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

        function deleteCalendar(calendarId) {
            var deferred = $q.defer();

            $http.delete(api.calendar(activityId, calendarId)).then(success, error);

            return deferred.promise;

            function success() {
                _deleteInstance(calendarId);
                deferred.resolve(calendars);
            }
            function error(response) {
                deferred.reject(response.data);
            }
        }

        function getCalendar(calendarId) {
            var deferred = $q.defer();
            var calendar = new Calendar();

            angular.extend(calendar, _retrieveInstance(calendarId));
            deferred.resolve(calendar);

            return deferred.promise;
        }

        function fetchCalendar(activity_id, calendarId) {
            var deferred = $q.defer();
            activityId = activity_id;

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

        function loadCalendars(activity_id, active) {
            var actives = active || false;
            activityId = activity_id;

            if (calendars.length > 0) {
                var activity_calendar_id = calendars[0].activity;
                if (activity_calendar_id == activityId){ return calendars; }
            }

            if (actives) { config.actives = true; }

            return $http.get(api.calendars(activityId)).then(success, error);

            function success(response) {
                console.log('CalendarsManager. Calendars response:', response);
                _setCalendars(response.data);
                return calendars;
            }

            function error(response) {
                return response.data;
            }
        }

        function setCalendar(calendarData) {
            var calendar = _search(calendarData.id);

            if (calendar){
                calendar.setData(calendarData);
            } else {
                calendar = _retrieveInstance(calendarData.id, calendarData);
                _addCalendar(calendar);
            }

            return calendar;
        }

        //--------- Internal Functions ---------//

        function _retrieveInstance(calendarId, calendarData) {
            var instance = _search(calendarId);
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

        function _search(calendarId) {
            return _pool[calendarId];
        }

        function _deleteInstance(calendarId) {
            var instance = _search(calendarId);
            if (instance){
                angular.forEach(calendars, function (calendar, index) {
                    if (calendar.id == instance.id){ calendars.splice(index, 1); }
                });
                delete _pool[calendarId];
            }
        }
        function _setCalendars(calendarsData) {
            angular.forEach(calendarsData, function (calendarData) {
                var calendar = new Calendar(calendarData);
                _addCalendar(calendar);
            });
        }

        function _addCalendar(calendar) {
            _pool[calendar.id] = calendar;
            calendars.push(calendar);
        }
    }

})();
