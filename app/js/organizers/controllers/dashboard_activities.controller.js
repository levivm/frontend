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
        angular.extend(vm, {
            organizer : organizer,
            isCollapsed : true,
            open_activities : [],
            closed_activities : [],
            inactive_activities : [],
            openOptions : {
                actions: ['edit', 'manage']
            },
            closedOptions : {
                actions: ['republish'],
                disabled: true
            },
            inactiveOptions : {
                actions: ['edit'],
                isInactive: true
            }
        });
        var active_activities = [];

        _activate();

        //--------- Exposed Functions ---------//

        //--------- Internal Functions ---------//

        function _assignActivities(){
            vm.open_activities = [];
            vm.closed_activities = [];

            active_activities = _.filter(activities, {'published': true});
            vm.inactive_activities = _.filter(activities, {'published': false});

            angular.forEach(active_activities, filterActivity);

            function filterActivity(activity){
                if(activity.last_date < Date.now()){
                    vm.closed_activities.push(activity);
                } else {
                    vm.open_activities.push(activity);
                }
            }
        }

        function _mapMainPicture(activity){
            angular.forEach(activity.pictures, function(picture, index, array){
                if(picture.main_photo){
                    activity.main_photo = picture.photo;
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
                ACTION_CREATE_ACTIVITY: "Crear Actividad",
                ACTION_PUBLISH_ACTIVITY: "Publicar Actividad",
                ACTION_REPUBLISH_ACTIVITY: "Republicar Actividad",
                COPY_OPEN: "Revisa las actividades que tienes publicadas actualmente.",
                COPY_CLOSED: "Revisa tus actividades que estuvieron publicadas. Si lo deseas puedes"
                    + " republicarlas.",
                COPY_EMPTY_CLOSED: "Por ahora no tienes ninguna actividad cerrada. ¿Te animas a publicar " +
                "una actividad en este momento? Te prometemos que será fácil.",
                COPY_INACTIVE: "Revisa las actividades que no has completado o publicado aún",
                COPY_EMPTY_OPEN: "Por ahora no tienes ninguna actividad abierta. ¿Te animas a publicar una "
                + "actividad en este momento? Te prometemos que será fácil.",
                COPY_EMPTY_INACTIVE: "Parece ser el momento perfecto para crear y publicar una nueva actividad",
                LABEL_EMPTY_OPEN: "No tienes actividades abiertas",
                LABEL_EMPTY_CLOSED: "No tienes actividades cerradas",
                LABEL_EMPTY_INACTIVE: "Actualmente no tienes borradores de actividades",
                SECTION_ACTIVITIES: "Mis Actividades",
                TAB_OPEN: "Abiertas",
                TAB_CLOSED: "Cerradas",
                TAB_INACTIVE: "Inactivas"
            });
        }

        function _activate() {
            _setStrings();
            activities.map(_mapMainPicture);
            _assignActivities();
        }

    }

})();
