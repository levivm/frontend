(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailController', ActivityDetailController);

    ActivityDetailController.$inject = ['$state', 'cities', 'activity', 'calendars'];

    function ActivityDetailController($state, cities, activity, calendars) {
        var pc = this;

        console.log(activity);
        console.log(calendars);
        pc.city = _.result(_.findWhere(cities, {id: activity.location.city}), 'name');
        pc.calendar = calendars[0];
        pc.activity = activity;
        pc.organizer = activity.organizer;

        pc.changeState = function (state) {
            $state.go('activities-detail.' + state);
        }
    }
})();