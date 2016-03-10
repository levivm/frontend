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
    StudentMessagesCtrl.$inject = ['student', 'titleTruncateSize', 'Analytics', 'StudentServerApi'];

    function StudentMessagesCtrl(student, titleTruncateSize, Analytics, StudentServerApi) {
        var vm = this;
        var api = StudentServerApi;


        angular.extend(vm,{
            activities: null
        });

        activate();

        var orders = [];
        var refunds = [];

        /*      Exposed Functions      */


        /*       Internal Functions      */



        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                SEARCH_PLACEHOLDER: "Buscar"
            });
        }

        function activate() {
            _setStrings();
        }

    }

})();
