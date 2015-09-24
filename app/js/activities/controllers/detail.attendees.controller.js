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

    ActivityDetailAttendeesController.$inject = ['calendars'];

    function ActivityDetailAttendeesController(calendars) {

        var vm = this;

        vm.pageChanged = pageChanged;

        initialize();

        function pageChanged() {
            _assistantByPage();
        }

        function _getAssistants() {
            var assistants = [];
            _.forEach(vm.calendars, function (calendar) {
                assistants.push(calendar.assistants);
            });
            assistants = _.flatten(assistants, true);
            assistants = [
                {'first_name': "Fernando", "email": "fer@trulii.com"},
                {'first_name': "Daniel", "email": "daniel@trulii.com"},
                {'first_name': "Rodrigo", "email": "ror@trulii.com"},
                {'first_name': "Levi", "email": "levi@trulii.com"},
                {'first_name': "Harvey", "email": "harvey@trulii.com"},
                {'first_name': "Maria", "email": "maria@trulii.com"}];
            _.forEach(assistants, function(assistant){
                if(assistant.hasOwnProperty('student') && assistant.student.photo){
                    assistant.photo = assistant.student.photo;
                } else {
                    assistant.photo = 'css/img/default_profile_pic.jpg';
                }
            });
            return assistants;
        }

        function _assistantByPage() {
            var assistants = angular.copy(vm.assistants);

            var page = vm.currentPage - 1;
            var start = vm.itemsPerPage * page;
            var end = start + vm.itemsPerPage;

            vm.assistants = assistants.slice(start, end)
        }

        function initialize() {
            vm.currentPage = 1;
            vm.itemsPerPage = 10;
            vm.maxSize = 5;
            vm.calendars = calendars;
            vm.assistants = _getAssistants();
            vm.totalItems = vm.assistants.length;
            console.log('assistants:', vm.assistants);

            _assistantByPage();
        }
    }

})();
