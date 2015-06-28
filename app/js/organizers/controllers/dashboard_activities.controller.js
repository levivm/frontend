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
        vm.published_activities = null;
        vm.previous_activities = null;
        vm.draft_activities = null;
        vm.currentOptions = {
            actions: ['view', 'edit', 'manage']
        };
        vm.previousOptions = {
            actions: ['view', 'republish']
        };
        vm.draftOptions = {
            actions: ['view', 'edit']
        };

        activate();

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_PUBLISHED: "Revisa las actividades que tienes publicadas actualmente.",
                COPY_PREVIOUS: "Revisa tus actividades que estuvieron publicadas en Trulii. Si lo deseas puedes"
                    + " republicarlas",
                COPY_DRAFTS: "Revisa los registros que no has completado o publicado aún en Trulii ¿Qué esperas "
                    + "para publicarlos?",
                SECTION_ACTIVITIES: "Mis Actividades",
                TAB_PUBLISHED: "Publicadas",
                TAB_PREVIOUS: "Anteriores",
                TAB_DRAFTS: "Borradores",
            });
        }

        function activate() {

            setStrings();

            vm.previous_activities = _.filter(activities, function (activity) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);

                if (!(activity.last_date)) return false;

                var activity_date = new Date(activity.last_date);
                activity_date.setHours(0, 0, 0, 0);

                return !!activity.last_date && activity_date < today && activity.published
            });

            vm.draft_activities = _.filter(activities, 'published', false);

            vm.published_activities = _.difference(_.filter(activities, {'enroll_open': true, 'published': true}),
                vm.previous_activities);
        }

    }

})();