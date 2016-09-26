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

    ActivityMessagesCtrl.$inject = ['$q','ActivitiesManager', 'activity', 'messages',  'Error', 'Toast'];
    function ActivityMessagesCtrl($q, ActivitiesManager, activity, messages,  Error, Toast) {

        var vm = this;
        angular.extend(vm, {
            activity: activity,
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
            vm.showMessage = !vm.showMessage;
        }


        function submitMessage(){
           Error.form.clear(vm.message_form);
           if(!vm.message.calendar){
                vm.message.calendar={
                    id: undefined
                };
           }
           activity.sendMessage(vm.message).then(_success, _error);
           
        }


        //--------- Internal Functions ---------//


        function _loadCalendars(){

            if (!_.isEmpty(vm.calendars))
                return vm.calendars;

            ActivitiesManager.getActivity(activity.id)
            .then(
              function(response){
                vm.calendars = response.calendars;
                vm.message.calendar = vm.activity.is_open ? vm.calendars[0]:null;
              }
            );
        }

        function _error(response) {
            if (response.data) { Error.form.add(vm.message_form, response.data); }
            return $q.reject(response);
        }

        function _success(response){
          vm.toggleMessageShow();
          Toast.success("Su mensaje ha sido enviado");
          vm.pageChange();
          vm.message.detail = null;
          vm.message.subject = null;
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_NEW_MESSAGE: "Nuevo Mensaje",
                SEARCH_PLACEHOLDER: "Buscar",
                SECTION_MESSAGES: "Mensajes",
                OPTION_ACTIVITY_DEFAULT: "Elige una actividad",
                OPTION_CALENDAR_DEFAULT: "Elige una fecha de inicio",
                LABEL_INITIAL_DATE: "Fecha de inicio: ",
                LABEL_SEND_MESSAGE: "Enviar",
                LABEL_CALENDAR: "Calendarios",
                LABEL_CANCEL_MESSAGE: "Cancelar",
                EMAIL_MODAL_MESSAGE_LABEL: "Mensaje",
                SUBJECT_MESSAGE_PLACEHOLDER:"Asunto",
                MODAL_MESSAGE_PLACEHOLDER:"Este mensaje llegará a todos los usuarios inscritos en esta actividad",
                COPY_NO_MESSAGES: "Aún no ha enviado ningún mensaje a sus asistentes",
                COPY_MESSAGES:"Envíales un mensaje a los asitentes para comunicarles cualquier novedad sobre la actividad",
                PREVIOUS_TEXT:"Previo",
                NEXT_TEXT:"Siguiente"
            });
        }

        function _activate() {
            _setStrings();
            _loadCalendars();
        }

    }

})();
