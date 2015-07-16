
/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.ActivitiesManageCtrl
 * @description ActivitiesManageCtrl
 * @requires activity The activity being accessed
 */
(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('ActivitiesManageCtrl', ActivitiesManageCtrl);

    ActivitiesManageCtrl.$inject = ['activity'];

    function ActivitiesManageCtrl(activity) {

        var vm = this;

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
                LABEL_EMPTY_PUBLISHED: "No tienes ninguna actividad publicada",
                COPY_EMPTY_PUBLISHED: "Parece ser el momento perfecto para pulir y publicar una actividad que tengas como borrador, "
                    + " republicar una actividad pasada o crear una desde cero",
                LABEL_EMPTY_PREVIOUS: "No tienes actividades pasadas",
                COPY_EMPTY_PREVIOUS: "Ninguna de tus actividades publicadas se han vencido hasta ahora",
                LABEL_EMPTY_DRAFTS: "Actualmente no tienes borradores de actividades",
                COPY_EMPTY_DRAFTS: "Parece ser el momento perfecto para crear y publicar una nueva actividad",
                SECTION_ACTIVITIES: "Mis Actividades",
                TAB_PUBLISHED: "Publicadas",
                TAB_PREVIOUS: "Anteriores",
                TAB_DRAFTS: "Borradores",

                SECTION_ORDERS: "Ordenes de Compra",
                SECTION_ASSISTANTS: "Lista de Asistentes"
            });
        }

        function activate() {
            setStrings();
            console.log('activity:', activity);
            console.log('activity.organizer:', activity.organizer);
            activity = mapMainPicture(activity);
        }

    }

})();