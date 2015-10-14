/**
 * @ngdoc service
 * @name trulii.activities.services.Calendar
 * @description Calendar Service
 * @requires ng.$http
 * @requires ng.$q
 * @requires ng.$filter
 * @requires trulii.activities.services.ActivityServerApi
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.services')
        .factory('Calendar', Calendar);

    Calendar.$inject = ['$http', '$q', '$filter', 'ActivityServerApi'];

    function Calendar($http, $q, $filter, ActivityServerApi) {

        var api = ActivityServerApi;

        function Calendar(calendarData) {
            if (calendarData) {
                this.setData(calendarData);
            } else {

                var today = new Date();
                var tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
                this.initial_date = today;
                this.minStartDate = today;
                this.closing_sale = tomorrow;
                this.capacity = 1;

                this.sessions = [];
                this.number_of_sessions = 0;
                this.last_sn = 0;
            }
        }

        Calendar.prototype = {
            setData : function (calendarData) {

                var that = this;
                angular.extend(this, calendarData);
                this.sessions = $filter('orderBy')(this.sessions, 'date');

                this.initial_date = new Date(this.initial_date);
                this.closing_sale = new Date(this.closing_sale);
                angular.forEach(this.sessions, function (session, index) {

                    session.date = new Date(session.date);
                    that.changeSessionDate(index, session);

                    // session.end_time   = null;
                    // session.start_time = null;
                    session.end_time = new Date(session.end_time);
                    session.start_time = new Date(session.start_time);


                });

                this.last_sn = this.number_of_sessions;
            },
            load : function (activity_id) {

                var that = this;
                that.activity = activity_id;

                // serverConf.url+'/api/activities/'+activity_id+'/calendar/'
                return $http.get(api.calendars(activity_id))
                    .then(function (response) {
                        that.setData(response.data);
                        return that;
                    }, function (response) {
                        return that;
                    });

            },
            create : function () {
                var activity_id = this.activity;
                var calendar_data = angular.copy(this);

                calendar_data.setToSave();

                console.log(this);
                var that = this;
                // serverConf.url+'/api/activities/'+activity_id+'/calendars/'
                return $http.post(api.calendars(activity_id), calendar_data)
                    .then(function (response) {
                        that.setData(response.data);
                        return that;
                    }, function (response) {
                        return $q.reject(response.data);
                    });

            },
            update : function () {

                var activity_id = this.activity;
                var calendar_copy = angular.copy(this);
                calendar_copy.setToSave();
                var that = this;
                // serverConf.url+'/api/activities/'+activity_id+'/calendars/'+this.id
                return $http.put(api.calendar(activity_id, this.id), calendar_copy)
                    .then(function (response) {
                        that.setData(response.data);
                        return response.data;
                    },
                    function (response) {
                        return $q.reject(response.data);
                    });

            },
            setToSave : function () {

                var _initial_date = this.initial_date;
                var _closing_sale = this.closing_sale;

                this.initial_date = this.initial_date.valueOf();
                this.closing_sale = this.closing_sale.valueOf();

                angular.forEach(this.sessions, function (session) {
                    session.date = session.date.valueOf();
                    session.end_time = session.end_time.valueOf();
                    session.start_time = session.start_time.valueOf();
                });
            },
            changeStartDate : function () {

                var initial_date = this.initial_date;

                if (this.initial_date > this.closing_sale)
                    this.closing_sale = this.initial_date;

            },
            changeCloseDate : function () {

                var closing_sale = this.closing_sale;

                if (this.initial_date > this.closing_sale)
                    this.closing_sale = this.initial_date;
            },
            openCloseDate : function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                this.endOpened = true;
            },
            openStartDate : function ($event) {
                $event.preventDefault();
                $event.stopPropagation();
                this.startOpened = true;

            },
            openSessionDate : function ($event, session) {
                $event.preventDefault();
                $event.stopPropagation();
                session.openDate = true;
            },
            changeSessionsN : function () {

                if (this.number_of_sessions > 10)
                    return;

                var difference = this.number_of_sessions - this.last_sn;
                var abs_difference = Math.abs(difference);

                for (var i = 0; i < abs_difference; i++) {

                    if (difference > 0) {

                        var index = this.number_of_sessions - 1;

                        var previous_s = index ? this.sessions[index - 1] : null;




                        // var previous_s_date = previous_s.date.getTime();
                        var date = index ? new Date(previous_s.date.getTime() + 24 * 60 * 60 * 1000) : this.initial_date;

                        // var minDate = new Date(date.getTime() - 24 * 60 * 60 * 1000);
                        var minDate = index ? new Date(previous_s.date.getTime()):this.initial_date;
                        //var minDate =index ? new Date(previous_s.date.getTime()+24*60*60*1000):date;

                        //var _start_time = previous_s && previous_s.date
                        var hours = index ? previous_s.start_time.getHours() : 10;

                        var start_time = new Date();
                        start_time.setHours(hours);
                        start_time.setMinutes(0);

                        var end_time = new Date();
                        end_time.setHours(hours + 3);
                        end_time.setMinutes(0);


                        var session = {
                            openDate : false,
                            date : date,
                            minDate : minDate,
                            start_time : start_time,
                            end_time : end_time,
                        };
                        this.sessions.push(session);
                    }
                    else {
                        this.sessions.pop();
                    }
                }

                this.last_sn = this.number_of_sessions;
                //return this.number_of_sessions

            },
            changeSessionDate : function ($index, session) {

                var size = this.sessions.length;
                var rest_sessions = this.sessions.slice($index + 1, $index + size);
                var previous_sessions = this.sessions.slice(0, $index);

                rest_sessions.map(function (value) {
                    value.date = value.date <= session.date ? session.date : value.date;
                    value.minDate = session.date;
                });

                previous_sessions.map(function (value) {
                    value.maxDate = session.date;
                });

            },
            changeStartTime : function (session) {

                session.end_time = new Date(session.end_time);
                session.start_time = new Date(session.start_time);

                var start_time = session.start_time.getHours();
                var end_time = session.end_time.getHours();

                if (start_time >= end_time) {
                    var new_end_time = new Date();
                    new_end_time.setHours(start_time + 1);
                    new_end_time.setMinutes(0);
                    session.end_time = new_end_time;
                }

            },
            changeEndTime : function (session) {

                session.end_time = new Date(session.end_time);
                session.start_time = new Date(session.start_time);

                var start_time = session.start_time.getHours();
                var end_time = session.end_time.getHours();

                if (start_time >= end_time) {
                    var new_start_time = new Date();
                    new_start_time.setHours(end_time - 1);
                    new_start_time.setMinutes(0);
                    session.start_time = new_start_time;
                }

            },
            hasAssistants: function(){
                return this.assistants.length > 0;
            },
            addAssistants : function (assistants) {
                this.assistants = this.assistants.concat(assistants);
            },
            hasAssistantByEmail: function (email){
                console.log(email, this.assistants);
                return this.assistants.some(function(assistant){
                    console.log('assistant email', assistant.email === email, assistant.email);
                    return assistant.email === email;
                });
            }
        };

        return Calendar;
    }
})();
