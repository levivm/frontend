(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailAttendeesController', ActivityDetailAttendeesController);

    ActivityDetailAttendeesController.$inject = ['calendars'];

    function ActivityDetailAttendeesController(calendars) {
        var vm = this;

        vm.pageChanged = pageChanged;
        vm.getAssistantPicture = getAssistantPicture;

        initialize();

        function pageChanged() {
            _assistantByPage();
        }

        function getAssistantPicture(assistant){
            console.log('assistant:',assistant);
            if(!!assistant.picture){
                return assistant.picture;
            } else {
                return 'css/img/default_profile_pic.jpg';
            }
        }

        function _getAssistants() {
            var assistants = [];
            _.forEach(calendars, function (calendar) {
                assistants.push(calendar.assistants);
            });

            return _.flatten(assistants, true);
        }

        function _assistantByPage() {
            var assistants = angular.copy(vm._assistants);

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
            vm._assistants = _getAssistants();
            vm.totalItems = vm._assistants.length;

            _assistantByPage();
        }
    }

})();