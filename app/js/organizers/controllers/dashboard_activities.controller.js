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
        vm.published_activities = [];
        vm.previous_activities = [];
        vm.draft_activities = [];
        vm.currentOptions = {
            actions: ['view', 'edit', 'manage']
        };
        vm.previousOptions = {
            actions: ['view', 'republish'],
            disabled: true
        };
        vm.draftOptions = {
            actions: ['view', 'edit'],
            isDraft: true
        };

        activate();

        function mapMainPicture(activity){
            angular.forEach(activity.photos, function(photo, index, array){
                if(photo.main_photo){
                    activity.main_photo = photo.photo;
                }

                if( index === (array.length - 1) && !activity.main_photo){
                    activity.main_photo = array[0].photo;
                }
            });

            return activity;
        }

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_PUBLISHED: "Revisa las actividades que tienes publicadas actualmente.",
                COPY_PREVIOUS: "Revisa tus actividades que estuvieron publicadas en Trulii. Si lo deseas puedes"
                    + " republicarlas.",
                COPY_DRAFTS: "Revisa los registros que no has completado o publicado aún en Trulii ¿Qué esperas "
                    + "para publicarlos?",
                
                COPY_EMPTY_PUBLISHED: "Por ahora no tiene ninguna actividad publicada. ¿Se anima a publicar una actividad en este momento?",
                LABEL_EMPTY_PREVIOUS: "No tienes actividades pasadas",
                COPY_EMPTY_PREVIOUS: "Ninguna de tus actividades publicadas se han vencido hasta ahora",
                LABEL_EMPTY_DRAFTS: "Actualmente no tienes borradores de actividades",
                COPY_EMPTY_DRAFTS: "Parece ser el momento perfecto para crear y publicar una nueva actividad",
                SECTION_ACTIVITIES: "Mis Actividades",
                TAB_PUBLISHED: "Publicadas",
                TAB_PREVIOUS: "Anteriores",
                TAB_DRAFTS: "Borradores"
            });
        }

        function activate() {
            setStrings();
            console.log('activities:', activities);
            activities.map(mapMainPicture);
            vm.previous_activities = _.filter(activities, function (activity) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);

                if (!(activity.last_date)) return false;

                var activity_date = new Date(activity.last_date);
                activity_date.setHours(0, 0, 0, 0);
                return !!activity.last_date && activity_date < today && activity.published
            });
            vm.draft_activities = _.filter(activities, 'published', false);
            //vm.published_activities = _.difference(_.filter(activities, {'enroll_open': true, 'published': true}),
            //    vm.previous_activities);

            vm.published_activities = activities;
        }

    }

})();