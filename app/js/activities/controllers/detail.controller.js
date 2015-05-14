(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailController', ActivityDetailController);

    ActivityDetailController.$inject = ['$state','Toast', 'cities', 'activity', 'calendars'];

    function ActivityDetailController($state, Toast,cities, activity, calendars) {
        var pc = this;

        pc.city = _.result(_.findWhere(cities, {id: activity.location.city}), 'name');
        pc.calendar = calendars[0];
        pc.activity = activity;
        pc.organizer = activity.organizer;
        pc.calendar_selected = pc.calendar;
        pc.strings = {};
        pc.strings.ACTIVITY_DISABLED = "Esta actividad se encuentra inactiva";
        
        if(!(pc.activity.published)){
            Toast.setPosition("toast-top-center")
            Toast.error(pc.strings.ACTIVITY_DISABLED); 
        }


        pc.changeState = function (state) {
            $state.go('activities-detail.' + state);
        };

        pc.changeCalendarSelected = function(calendar) {
            pc.calendar_selected = calendar;
        }
    }
})();