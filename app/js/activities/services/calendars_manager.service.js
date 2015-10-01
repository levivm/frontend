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

    CalendarsManager.$inject = ['$http', '$q', '$filter', 'ActivityServerApi', 'Calendar'];

    function CalendarsManager($http, $q, $filter, ActivityServerApi, Calendar) {

        var api = ActivityServerApi;
        //noinspection UnnecessaryLocalVariableJS
        var CalendarsManager = {
            _pool : {},
            calendars : [],
            _retrieveInstance : function (calendarId, calendarData) {
                console.log('pool', this._pool);
                var instance = this._search(calendarId);
                if (!(instance)) {
                    instance = new Calendar(calendarData);
                    instance.activity = this.activity_id;
                }
                return instance;
            },
            _search : function (calendarId) {
                return this._pool[calendarId];
            },
            _deleteInsntance : function (calendarId) {

                var scope = this;
                var instance = scope._search(calendarId);
                var calendars = angular.copy(scope.calendars);
                if (instance) {
                    angular.forEach(calendars, function (calendar, index) {

                        if (calendar.id == instance.id) {
                            scope.calendars.splice(index, 1);
                        }

                    });
                    delete scope._pool[calendarId];

                }

            },
            deleteCalendar : function (calendarId) {

                var deferred = $q.defer();
                var calendar = this._search(calendarId);

                var scope = this;

                return $http.delete(api.calendar(this.activity_id, calendarId))
                    .then(function (response) {
                        scope._deleteInsntance(calendarId);
                        deferred.resolve(scope.calendars);
                        return deferred.promise;
                    },
                    function (response) {
                        return $q.reject(response.data);
                    });

            },
            getCalendar : function (calendarId) {
                var deferred = $q.defer();
                var calendar = new Calendar();
                angular.extend(calendar, this._retrieveInstance(calendarId));
                deferred.resolve(calendar);
                return deferred.promise;
            },
            fetchCalendar : function (activityId, calendarId) {
                var scope = this;
                this.activity_id = activityId;
                var deferred = $q.defer();
                $http.get(api.calendar(activityId, calendarId))
                    .success(function (result) {
                        var calendar = scope._retrieveInstance(result.id, result);
                        deferred.resolve(calendar);
                    })
                    .error(function (result) {
                        deferred.reject(result);
                    });

                return deferred.promise;
            },
            loadCalendars : function (activity_id, active) {
                var actives = active || false;
                this.activity_id = activity_id;
                var scope = this;

                if (scope.calendars.length > 0) {
                    var activity_calendar_id = scope.calendars[0].activity;
                    if (activity_calendar_id == this.activity_id){ return scope.calendars; }
                }

                if (actives) { config.actives = true; }

                return $http.get(api.calendars(this.activity_id))
                    .then(function (response) {
                        console.log('CalendarsManagercalendars response:', response);
                        scope._setCalendars(response.data);
                        return scope.calendars
                    },
                    function (response) {
                        return response.data
                    });
            },

            _setCalendars : function (calendarsData) {

                var scope = this;
                    scope.calendars  = [];
                angular.forEach(calendarsData, function (calendarData) {
                    var calendar = new Calendar(calendarData);
                    scope.calendars.push(calendar);
                    scope._pool[calendar.id] = calendar;

                });

            },
            _addCalendar : function (calendar) {
                this._pool[calendar.id] = calendar;
                this.calendars.push(calendar);

            },
            setCalendar : function (calendarData) {
                var scope = this;
                var calendar = this._search(calendarData.id);

                if (calendar) {
                    calendar.setData(calendarData);
                } else {
                    calendar = scope._retrieveInstance(calendarData.id, calendarData);
                    this._addCalendar(calendar);

                }
                return calendar;
            }

        };

        return CalendarsManager;
    }

})();
