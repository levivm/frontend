(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityEnrollSuccessController', ActivityEnrollSuccessController);

    ActivityEnrollSuccessController.$inject = ['activity', 'calendar', 'organizerActivities'];

    function ActivityEnrollSuccessController(activity, calendar, organizerActivities){
        var vm = this;

        initialize();

        function _getOrganizerActivities() {
            return _.without(organizerActivities, activity)
        }

        function initialize() {
            vm.activity = activity;
            vm.calendar = calendar;
            vm.organizerActivities = _getOrganizerActivities();
        }
    }
})();