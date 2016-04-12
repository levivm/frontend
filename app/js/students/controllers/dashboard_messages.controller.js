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
    StudentMessagesCtrl.$inject = ['student', 'messages', 'titleTruncateSize', 'Analytics'];

    function StudentMessagesCtrl(student, messages, titleTruncateSize, Analytics) {
        var vm = this;


        angular.extend(vm,{
            messages: messages.results,
            paginationOpts: {
                totalItems: messages.count,
                itemsPerPage: 10,
                pageNumber: 1
            },
            pageChange: pageChange
        });

        activate();

        /*      Exposed Functions      */

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
                SEARCH_PLACEHOLDER: "Buscar",
                PREVIOUS_TEXT:"Previo",
                NEXT_TEXT:"Siguiente",
                COPY_NO_MESSAGES: "No tienes notificaciones por el momento"
            });
        }

        function activate() {
            _setStrings();
            console.log(vm.messages);
        }

    }

})();
