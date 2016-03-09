/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerMessageDetailCtrl
 * @description Handles Organizer Activities Dashboard
 * @requires organizer
 * @requires activities
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerMessageDetailCtrl', OrganizerMessageDetailCtrl);

    OrganizerMessageDetailCtrl.$inject = ['$http', 'organizer', 'OrganizerServerApi'];
    function OrganizerMessageDetailCtrl($http, organizer, OrganizerServerApi) {

        var vm = this;
        var api = OrganizerServerApi;
        angular.extend(vm, {
            organizer : organizer

        });


        _activate();

        //--------- Exposed Functions ---------//

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
            console.log(vm.organizer);
        }

    }

})();
