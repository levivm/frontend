/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityMessagesCtrl
 * @description Handles Activities Messages Dashboard
 * @requires activity
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityMessagesCtrl', ActivityMessagesCtrl);

    ActivityMessagesCtrl.$inject = ['ActivitiesManager', 'activity', 'messages', '$q', 'Error', 'Toast'];
    function ActivityMessagesCtrl(ActivitiesManager, activity, messages, $q, Error, Toast) {

        var vm = this;
        angular.extend(vm, {
            showMessage: false,
            toggleMessageShow:toggleMessageShow,
            messages: messages.results,
            calendars: {},
            message: {},
            submitMessage: submitMessage,
            paginationOpts: {
                totalItems: 0,
                itemsPerPage: 12,
                pageNumber: 1
            },
            pageChange: pageChange

        });


        _activate();

        //--------- Exposed Functions ---------//

        function pageChange(){
          activity.getMessages(vm.paginationOpts.pageNumber, vm.paginationOpts.itemsPerPage)
          .then(function (response) {
            vm.messages = response.results;
            vm.paginationOpts.totalItems = response.count;
            vm.messages = vm.messages.slice(0, vm.paginationOpts.itemsPerPage);
          });
        }


        function toggleMessageShow(){
            console.log(vm.showMessage);
            vm.showMessage = !vm.showMessage;
        }


        function submitMessage(){
          activity.sendMessage(vm.message).then(_success, _error)
        }


        //--------- Internal Functions ---------//


        function _loadCalendars(){
          ActivitiesManager.getActivity(activity.id)
            .then(
              function(response){
                vm.calendars = response.calendars;
              }
            );
        }
        
        function _error(response) {
            if (response.data) { Error.form.add(vm.login_form, response.data); }
            vm.errors.__all__ = response.data['non_field_errors'];
            return $q.reject(response);
        }

        function _success(response){
          vm.toggleMessageShow();
          Toast.success("Su mensaje ha sido enviado");
          vm.pageChange();
          vm.message = {};
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_NEW_MESSAGE: "Nuevo Mensaje",
                SEARCH_PLACEHOLDER: "Buscar",
                OPTION_ACTIVITY_DEFAULT: "Seleccione una actividad",
                OPTION_CALENDAR_DEFAULT: "Seleccione una fecha de inicio",
                LABEL_INITIAL_DATE: "Fecha de inicio: ",
                LABEL_SEND_MESSAGE: "Enviar",
                SUBJECT_MESSAGE_PLACEHOLDER:"Asunto",
                MODAL_MESSAGE_PLACEHOLDER:"Este mensaje llegará a todos los usuarios inscritos en esta actividad",
                COPY_NO_MESSAGES: "Aún no ha enviado ningún mensaje a sus asistentes",
                PREVIOUS_TEXT:"Previo",
                NEXT_TEXT:"Siguiente"
            });
        }

        function _activate() {
            _setStrings();
            _loadCalendars();
            console.log(vm.messages);
        }

    }

})();
