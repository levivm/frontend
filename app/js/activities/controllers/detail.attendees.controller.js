/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDetailAttendeesController
 * @description Controller for Activity Detail Attendees Sub-Component. Handles
 * display of activity assistants.
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailAttendeesController', ActivityDetailAttendeesController);

    ActivityDetailAttendeesController.$inject = ['$state','calendars', 'serverConf'];

    function ActivityDetailAttendeesController($state,calendars, serverConf) {

        var vm = this;
        var assistants = [];

        angular.extend(vm, {
            getAmazonUrl: getAmazonUrl,
            attendeesOffset: 0,
            attendeesScrollUp: attendeesScrollUp,
            attendeesScrollDown: attendeesScrollDown
        });

        initialize();

        //--------- Exposed Functions ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }
        
        function attendeesScrollDown(){
            console.log(vm.attendeesOffset);
            if(vm.attendeesOffset*-1 <= vm.assistants.length -2){
                vm.attendeesOffset--;
                document.getElementsByClassName('attendees-container__body__attendees-list')[0].style.transform = 'translateY('+ vm.attendeesOffset*60 +'px)';
            }
        }

        function attendeesScrollUp (){
            console.log(vm.attendeesOffset);
            if(vm.attendeesOffset < 0){
                vm.attendeesOffset++;
                document.getElementsByClassName('attendees-container__body__attendees-list')[0].style.transform = 'translateY('+ vm.attendeesOffset*60 +'px)';
            }
        }
        //--------- Internal Functions ---------//
        
        function _getAssistants() {
            var assistants = [];
            //console.log('calendars',vm.calendars);
            _.forEach(vm.calendars, function (calendar) {
                assistants.push(calendar.assistants);
            });
            //console.log('assistants pre flatten',assistants);

            assistants = _.flatten(assistants, true);
            //console.log('assistants post flatten',assistants);

            // TODO for testing purposes
            //assistants = [
            //    {'first_name': "Fernando", "email": "fer@trulii.com", id: 1},
            //    {'first_name': "Daniel", "email": "daniel@trulii.com", id: 2},
            //    {'first_name': "Rodrigo", "email": "ror@trulii.com", id: 3},
            //    {'first_name': "Levi", "email": "levi@trulii.com", id: 4},
            //    {'first_name': "Harvey", "email": "harvey@trulii.com", id: 5},
            //    {'first_name': "Maria", "email": "maria@trulii.com", id: 6}];
            _.forEach(assistants, function(assistant){
                if(assistant.hasOwnProperty('student') && assistant.student.photo){
                    assistant.photo = assistant.student.photo;
                } else {
                    assistant.photo =  getAmazonUrl('static/img/default_profile_pic.jpg');
                }
            });
            vm.assistants = assistants;
            console.log(assistants);
            return assistants;
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }

            var join_us_string = $state.current.name !== 'activities-enroll-success' ? '¡Faltas tú¡': '';

            angular.extend(vm.strings, {
                LABEL_ATTENDEES: "Asistentes",
                COPY_ATTENDEES_LIST: "Hasta ahora estas personas asistirán a esta actividad.",
                COPY_BE_THE_FIRST: "!Se el primero en inscribirte y aprovecha en invitar a tus amigos¡",
                SEE_MORE_DATES: "Ver más fechas de inicio"
            });
        }

        function initialize() {
            _setStrings();
            vm.calendars = calendars;
            assistants = _getAssistants();
        }
    }

})();
