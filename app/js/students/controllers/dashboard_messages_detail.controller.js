/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentMessageDetailCtrl
 * @description Handles Student Messages Dashboard
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentMessageDetailCtrl', StudentMessageDetailCtrl);
    StudentMessageDetailCtrl.$inject = ['student', 'message', '$state', 'titleTruncateSize', 'Analytics', 'Toast'];

    function StudentMessageDetailCtrl(student, message, $state, titleTruncateSize, Analytics, Toast) {
        var vm = this;


        angular.extend(vm,{
          message: message,
          deleteMessage: deleteMessage,
          readMessage: readMessage
        });

        activate();

        /*      Exposed Functions      */
        
        function deleteMessage(){
          student.deleteMessage(message.id)
            .then(function(){
              Toast.success("Mensaje borrado");
              $state.go('student-dashboard.notifications');
            });
        }
        
        function readMessage(){
          student.readMessage(message.id)
            .then(function(){
              Toast.success("Mensaje marcado como leido");
              $state.go('student-dashboard.notifications');
            });
        }

        /*       Internal Functions      */



        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {
                  MARK_AS_READ: "Marcar como leído"
                };
            }
            angular.extend(vm.strings, {
            });
        }

        function activate() {
            _setStrings();
        }

    }

})();
