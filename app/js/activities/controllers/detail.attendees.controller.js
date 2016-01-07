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

    ActivityDetailAttendeesController.$inject = ['$state','calendars'];

    function ActivityDetailAttendeesController($state,calendars) {

        var vm = this;
        var assistants = [];

        angular.extend(vm, {
            currentPage : 1,
            totalItems: 0,
            hasPrevious: false,
            hasNext: false,
            pageOptions: {
                itemsPerPage : 5,
                maxPages: 0
            },
            calendars: [],
            assistants: [],
            pageChanged: pageChanged,
            goToPrevious: goToPrevious,
            goToNext: goToNext
        });

        initialize();

        //--------- Exposed Functions ---------//

        function pageChanged() {
            var page = vm.currentPage - 1;
            var start = vm.pageOptions.itemsPerPage * page;
            var end = start + vm.pageOptions.itemsPerPage;
            vm.assistants = assistants.slice(start, end);

            //Update pagination flags
            vm.hasPrevious = vm.currentPage > 1;
            vm.hasNext = vm.currentPage < vm.pageOptions.maxPages;
        }

        function goToPrevious(){
            if(vm.currentPage > 1){
                vm.currentPage = vm.currentPage - 1;
                pageChanged();
            }
        }

        function goToNext(){
            if(vm.currentPage < vm.pageOptions.maxPages){
                vm.currentPage = vm.currentPage + 1;
                pageChanged();
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
                    assistant.photo = 'css/img/default_profile_pic.jpg';
                }
            });
            return assistants;
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }

            var join_us_string = $state.current.name !== 'activities-enroll-success' ? '¡Faltas tú¡': '';

            angular.extend(vm.strings, {
                COPY_SO_FAR: "Hasta ahora",
                COPY_ZERO_ATTENDEES: "esta actividad no tiene asistentes ¡Sé tú el primero!",
                COPY_ONE_ATTENDEE: "va 1 asistente ".concat(join_us_string),
                COPY_OTHER_ATTENDEES: "van {} asistentes ".concat(join_us_string),
            });
        }

        function initialize() {
            _setStrings();
            vm.calendars = calendars;
            assistants = _getAssistants();
            vm.totalItems = assistants.length;
            vm.pageOptions.maxPages = Math.ceil(vm.totalItems / vm.pageOptions.itemsPerPage);

            pageChanged();
        }
    }

})();
