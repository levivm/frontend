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

    OrganizerMessagesCtrl.$inject = ['ActivitiesManager', 'organizer', 'messages', 'activities', '$q', 'Error'];
    function OrganizerMessagesCtrl(ActivitiesManager, organizer, messages, activities, $q, Error) {

        var vm = this;
        angular.extend(vm, {
            organizer : organizer,
            showMessage: false,
            toggleMessageShow:toggleMessageShow,
            messages: messages.results,
            activities: activities,
            updateCalendars: updateCalendars,
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
          organizer.getMessages(vm.paginationOpts.pageNumber, vm.paginationOpts.itemsPerPage)
          .then(function (response) {
            vm.messages = response.data.results;
            vm.paginationOpts.totalItems = response.data.count;
            vm.messages = vm.messages.slice(0, vm.paginationOpts.itemsPerPage); 
          });
        }
        
        
        function toggleMessageShow(){
            console.log(vm.showMessage);
            vm.showMessage = !vm.showMessage;
        }
        
        function updateCalendars(){
          ActivitiesManager.getActivity(vm.message.activity.id)
            .then(
              function(response){
                vm.calendars = response.calendars;
              }
            );
        }
        
        function submitMessage(){
          organizer.sendMessage(vm.message).then(success, error)
        }


        //--------- Internal Functions ---------//

        
        function error(response) {
            if (response.data) { Error.form.add(vm.login_form, response.data); }
            vm.errors.__all__ = response.data['non_field_errors'];
            return $q.reject(response);
        }
        
        function success(response){
          vm.toggleMessageShow();
        }
            
        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                TITLE_NEW_MESSAGE: "Nuevo Mensaje",
                SEARCH_PLACEHOLDER: "Buscar",
                OPTION_ACTIVITY_DEFAULT: "Seleccione una actividad",
                OPTION_CALENDAR_DEFAULT: "Seleccione una fecha de inicio",
                LABEL_INITIAL_DATE: "Fecha de inicio: ",
                LABEL_SEND_MESSAGE: "Enviar",
                SUBJECT_MESSAGE_PLACEHOLDER:"Asunto",
                MODAL_MESSAGE_PLACEHOLDER:"Este mensaje llegará a todos los usuarios inscritos en esta actividad",
                COPY_NO_MESSAGES: "Aún no ha enviado ningún mensaje a sus asistentes"
            });
        }

        function _activate() {
            _setStrings();
            console.log(vm.messages);
            console.log(vm.organizer);
        }

    }

})();
