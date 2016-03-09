/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerMessagesCtrl
 * @description Handles Organizer Activities Dashboard
 * @requires organizer
 * @requires activities
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerMessagesCtrl', OrganizerMessagesCtrl);

    OrganizerMessagesCtrl.$inject = ['$http', 'organizer', 'OrganizerServerApi', 'activities'];
    function OrganizerMessagesCtrl($http, organizer, OrganizerServerApi, activities) {

        var vm = this;
        var api = OrganizerServerApi;
        angular.extend(vm, {
            organizer : organizer,
            showEmail: false,
            toggleEmailShow:toggleEmailShow,
            activities: activities.results

        });


        _activate();

        //--------- Exposed Functions ---------//

        function toggleEmailShow(){
            console.log(vm.showEmail);
          vm.showEmail = !vm.showEmail;
        }


        //--------- Internal Functions ---------//


        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                TITLE_NEW_MESSAGE: "Nuevo Mensaje",
                SEARCH_PLACEHOLDER: "Buscar",
                OPTION_ACTIVITY_DEFAULT: "Seleccione una actividad",
                OPTION_CALENDAR_DEFAULT: "Seleccione una fecha de inicio",
                LABEL_SEND_MESSAGE: "Enviar",
                SUBJECT_MESSAGE_PLACEHOLDER:"Asunto",
                MODAL_MESSAGE_PLACEHOLDER:"Este mensaje llegará a todos los usuarios inscritos en esta actividad"
            });
        }

        function _activate() {
            _setStrings();
            console.log(vm.activities);
            console.log(vm.organizer);
        }

    }

})();
