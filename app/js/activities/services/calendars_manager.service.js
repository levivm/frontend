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
        _pool: {},
        calendars: [],
        _retrieveInstance: function(calendarId, calendarData) {
            console.log('pool', this._pool);
            var instance = this._search(calendarId);
            //console.log("INSTANCIA",calendarId)
            if (!(instance)){
                instance = new Calendar(calendarData);
                //instance.setData(calendarData);                
                instance.activity = this.activity_id;
            }
            return instance;
        },
        _search: function(calendarId) {
            return this._pool[calendarId];
        },
        _deleteInsntance:function(calendarId){

            var scope = this;
            var instance = scope._search(calendarId);
            var calendars = angular.copy(scope.calendars);
            if (instance){
                angular.forEach(calendars,function(calendar,index){

                    if (calendar.id == instance.id){
                        scope.calendars.splice(index,1);
                    }

                });
                delete scope._pool[calendarId];

            }

        },
        deleteCalendar: function(calendarId){

            var deferred = $q.defer();
            var calendar = this._search(calendarId);
            
            var scope = this;

            return $http.delete(api.calendar(this.activity_id, calendarId))
                .then(function(response){
                    scope._deleteInsntance(calendarId);
                    deferred.resolve(scope.calendars);
                    return deferred.promise;
                },
                function(response){
                    return $q.reject(response.data);
                });

        },
        getCalendar: function(calendarId) {
            var calendar = new Calendar();
                angular.extend(calendar,this._retrieveInstance(calendarId));

            return calendar;
        },
        fetchCalendar: function (activityId, calendarId) {
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
        loadCalendars: function(activity_id, active) {
            var actives = active || false;
            this.activity_id = activity_id;
            //var deferred = $q.defer();

            var scope = this;

            if (scope.calendars.length > 0){
                return scope.calendars
            }

            // url += '?actives=true';
            var config = {};
            if (actives) {
                config.actives = true;
            }

            // serverConf.url+'/api/activities/'+this.activity_id+'/calendars/'
            return $http.get(api.calendars(this.activity_id), config)
                .then(function(response){
                    //scope.calendars = [];
                    scope._setCalendars(response.data);
                    console.log(response.data);
                    //scope.calendars = $filter('orderBy')(scope.calendars,'initial_date');
                    return scope.calendars
                },
                function(response){
                    return response.data
                });
        },

        _setCalendars: function (calendarsData){

            //scope.calendars = calendarsData;
            var scope = this;
            angular.forEach(calendarsData,function(calendarData){
                //this._retrieveInstance(calendarData);
                var calendar = new Calendar(calendarData);
                scope.calendars.push(calendar);
                scope._pool[calendar.id] = calendar;
                //var calendar = scope.setCalendar(calendarData);
                //    scope._addCalendar(calendar);

            });

            //return calendars
        },
        _addCalendar:function(calendar){
            this._pool[calendar.id] = calendar;
            this.calendars.push(calendar);
            //$filter('orderBy')(this.calendars,'initial_date');

        },
        setCalendar: function(calendarData) {
            var scope = this;
            var calendar = this._search(calendarData.id);

            if (calendar) {
                calendar.setData(calendarData);
            } else {
                calendar = scope._retrieveInstance(calendarData.id,calendarData);
                this._addCalendar(calendar);

            }
            return calendar;
        }

    };

    return CalendarsManager;
}

})();