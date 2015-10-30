/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerReviewCtrl
 * @description Handles Organizer Review Dashboard
 * @requires organizer
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerReviewCtrl', OrganizerReviewCtrl);

    OrganizerReviewCtrl.$inject = [];
    function OrganizerReviewCtrl() {

        var vm = this;



        _activate();

        //--------- Exposed Functions ---------//



        //--------- Internal Functions ---------//

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SAVE: "Guardar",
                TAB_REVIEWS_PENDING: "Sin revisar",
                TAB_REVIEWS_DONE: "Revisados",
                COPY_SEARCH_REVIEWS: "Revisa los comentarios que han hecho a tus actividades",
                COPY_PENDING_APPROVAL: "Comentario siendo revisado por trulii",
                COPY_COMMENT_PLACEHOLDER: "Escribe aqui tu respuesta al comentario",
                COPY_REPORT_DISCLAIMER: "Al reportar un comentario como inapropiado este será revisado por el equipo de Trulii para ser retirado público. Próximamente la enviaremos un correo con el resultado de nuestra evaluación",
                LABEL_SEARCH_ORDERS: "Filtrar por nombre de actividad",
                LABEL_REPORT_BUTTON: "Reportar",
                LABEL_REPLY_BUTTON: "Responder",
                LABEL_CANCEL_BUTTON: "Cancelar",
                LABEL_CONTINUE_BUTTON: "Continuar"
            });
        }

        function _activate() {
            _setStrings();
        }

    }

})();