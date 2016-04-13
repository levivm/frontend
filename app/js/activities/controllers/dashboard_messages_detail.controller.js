/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.ActivityMessageDetailCtrl
 * @description Handles Activities Message Detail Dashboard
 * @requires actifity
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('ActivityMessageDetailCtrl', ActivityMessageDetailCtrl);

    ActivityMessageDetailCtrl.$inject = ['activity', 'message', '$state', 'Toast'];
    function ActivityMessageDetailCtrl(activity, message, $state, Toast) {

        var vm = this;
        angular.extend(vm, {
            message: message,
            activity: activity

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
