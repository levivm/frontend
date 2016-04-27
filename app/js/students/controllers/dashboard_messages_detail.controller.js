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
    StudentMessageDetailCtrl.$inject = ['student', 'message', '$state', 'titleTruncateSize', 'Analytics', 'Toast', '$rootScope'];

    function StudentMessageDetailCtrl(student, message, $state, titleTruncateSize, Analytics, Toast, $rootScope) {
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
              $rootScope.$broadcast('update_notifications');
              $state.go('student-dashboard.notifications', {reload: true});
            });
        }
        
        function readMessage(){
          student.readMessage(message.id)
            .then(function(){
              Toast.success("Mensaje marcado como leido");
              $rootScope.$broadcast('update_notifications');
              $state.go('student-dashboard.notifications', {reload: true});
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
