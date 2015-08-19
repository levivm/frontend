/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerActivitiesCtrl
 * @description Handles Organizer Activities Dashboard
 * @requires organizer
 * @requires activities
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerActivitiesCtrl', OrganizerActivitiesCtrl);

    OrganizerActivitiesCtrl.$inject = ['organizer', 'activities'];
    function OrganizerActivitiesCtrl(organizer, activities) {

        var vm = this;
        vm.organizer = organizer;
        vm.isCollapsed = true;
        vm.open_activities = [];
        vm.closed_activities = [];
        vm.inactive_activities = [];
        vm.openOptions = {
            actions: ['view', 'edit', 'manage']
        };
        vm.closedOptions = {
            actions: ['view', 'republish'],
            disabled: true
        };
        vm.inactiveOptions = {
            actions: ['view', 'edit'],
            isInactive: true
        };

        _activate();

        //--------- Internal Functions ---------//

        function _mapMainPicture(activity){
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

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_OPEN: "Revisa las actividades que tienes publicadas actualmente.",
                COPY_CLOSED: "Revisa tus actividades que estuvieron publicadas en Trulii. Si lo deseas puedes"
                    + " republicarlas.",
                COPY_INACTIVE: "Revisa los registros que no has completado o publicado aún en Trulii ¿Qué esperas "
                    + "para publicarlos?",
                
                COPY_EMPTY_OPEN: "Por ahora no tiene ninguna actividad publicada. ¿Se anima a publicar una actividad en este momento?",
                LABEL_EMPTY_CLOSED: "No tienes actividades pasadas",
                COPY_EMPTY_CLOSED: "Ninguna de tus actividades publicadas se han vencido hasta ahora",
                LABEL_EMPTY_INACTIVE: "Actualmente no tienes borradores de actividades",
                COPY_EMPTY_INACTIVE: "Parece ser el momento perfecto para crear y publicar una nueva actividad",
                SECTION_ACTIVITIES: "Mis Actividades",
                TAB_OPEN: "Abiertas",
                TAB_CLOSED: "Cerradas",
                TAB_INACTIVE: "Inactivas"
            });
        }

        function _activate() {
            _setStrings();
            console.log('activities:', activities);
            activities.map(_mapMainPicture);
            vm.closed_activities = _.filter(activities, function (activity) {
                var today = new Date();
                today.setHours(0, 0, 0, 0);

                if (!(activity.last_date)) return false;

                var activity_date = new Date(activity.last_date);
                activity_date.setHours(0, 0, 0, 0);
                return !!activity.last_date && activity_date < today && activity.published
            });
            vm.inactive_activities = _.filter(activities, 'published', false);
            //vm.published_activities = _.difference(_.filter(activities, {'enroll_open': true, 'published': true}),
            //    vm.closed_activities);

            vm.open_activities = activities;
        }

    }

})();