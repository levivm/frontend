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
    StudentMessageDetailCtrl.$inject = ['student', 'message', 'titleTruncateSize', 'Analytics'];

    function StudentMessageDetailCtrl(student, message, titleTruncateSize, Analytics) {
        var vm = this;


        angular.extend(vm,{
          message: message
        });

        activate();

        /*      Exposed Functions      */


        /*       Internal Functions      */



        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
            });
        }

        function activate() {
            _setStrings();
        }

    }

})();
