/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentMessagesCtrl
 * @description Handles Student Messages Dashboard
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentMessagesCtrl', StudentMessagesCtrl);
    StudentMessagesCtrl.$inject = ['$state', 'student', 'messages',  'LocationManager', 'titleTruncateSize', 'Analytics'];

    function StudentMessagesCtrl($state, student, messages, LocationManager, titleTruncateSize, Analytics) {
        var vm = this;


        angular.extend(vm,{
            messages: messages.results,
            paginationOpts: {
                totalItems: messages.count,
                itemsPerPage: 10,
                pageNumber: 1
            },
            pageChange: pageChange,
            searchActivities:searchActivities
        });

        activate();

        /*      Exposed Functions      */
        function searchActivities(){
            var searchCity = LocationManager.getSearchCity();
            $state.go('search', {'city': searchCity.id});
        }
        function pageChange(){
          student.getMessages(vm.paginationOpts.pageNumber, vm.paginationOpts.itemsPerPage)
          .then(function (response) {
            vm.messages = response.data.results;
            vm.paginationOpts.totalItems = response.data.count;
            vm.messages = vm.messages.slice(0, vm.paginationOpts.itemsPerPage);
          });
        }

        /*       Internal Functions      */



        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SEARCH_ACTIVITY: "A ver qué encuentro",
                SEARCH_PLACEHOLDER: "Buscar",
                PREVIOUS_TEXT:"Previo",
                NEXT_TEXT:"Siguiente",
                SECTION_MESSAGES: "Notificaciones",
                COPY_NO_MESSAGES: "Por los momentos ningún organizador se ha comunicado contigo",
                COPY_MESSAGES: "El organizador se contactará por esta via para notificarte cualquier novedad sobre la actividad."
            });
        }

        function activate() {
            _setStrings();
        }

    }

})();
