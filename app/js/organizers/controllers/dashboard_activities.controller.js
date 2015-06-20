/**
 * Register controller
 * @namespace thinkster.organizers.controllers
 */
(function () {
    'use strict';


    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerActivitiesCtrl', OrganizerActivitiesCtrl);

    OrganizerActivitiesCtrl.$inject = ['organizer', 'activities'];
    /**
     * @namespace RegisterController
     */
    function OrganizerActivitiesCtrl(organizer, activities) {


        var vm = this;
        vm.organizer = organizer;
        vm.isCollapsed = true;
        vm.draft_activities = null;
        vm.actual_activities = null;
        vm.options = {
            actions: ['edit']
        };

        activate();

        function activate() {
            vm.previous_activities = _.filter(activities, function (activity) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);

                if (!(activity.last_date)) return false;

                var activity_date = new Date(activity.last_date);
                activity_date.setHours(0, 0, 0, 0);

                return !!activity.last_date && activity_date < today && activity.published
            });

            vm.draft_activities = _.filter(activities, 'published', false);

            vm.actual_activities = _.difference(_.filter(activities, {'enroll_open': true, 'published': true}),
                vm.previous_activities);
        }

    }

})();