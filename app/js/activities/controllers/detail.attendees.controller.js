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
            if(vm.attendeesOffset*-1 <= vm.assistants.length -2){
                vm.attendeesOffset--;
                document.getElementsByClassName('attendees-container__body__attendees-list')[0].style.transform = 'translateY('+ vm.attendeesOffset*60 +'px)';
            }
        }

        function attendeesScrollUp (){
            if(vm.attendeesOffset < 0){
                vm.attendeesOffset++;
                document.getElementsByClassName('attendees-container__body__attendees-list')[0].style.transform = 'translateY('+ vm.attendeesOffset*60 +'px)';
            }
        }
        //--------- Internal Functions ---------//
        
        function _getAssistants() {
            var assistants = [];
            _.forEach(vm.calendars, function (calendar) {
                assistants.push(calendar.assistants);
            });

            assistants = _.flatten(assistants, true);

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
