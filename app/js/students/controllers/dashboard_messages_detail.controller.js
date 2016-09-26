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
          deleteMessage: deleteMessage
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
        
        

        /*       Internal Functions      */

        function _readMessage(){
          student.readMessage(vm.message.id)
            .then(function(data){
              vm.message.is_read = true;
              $rootScope.$broadcast('update_notifications');
              //$state.go('student-dashboard.notifications', {reload: true});
            });
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                SECTION_MESSAGES: "Notificaciones",
                MARK_AS_READ: "Marcar como leído",
                ACTION_GO_BACK: "Regresar"
            });
        }

        function activate() {
            _setStrings();
            
            if(!vm.message.is_read)
                _readMessage()
        }

    }

})();
