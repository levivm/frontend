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
    StudentMessageDetailCtrl.$inject = ['student', 'titleTruncateSize', 'Analytics', 'StudentServerApi'];

    function StudentMessageDetailCtrl(student, titleTruncateSize, Analytics, StudentServerApi) {
        var vm = this;
        var api = StudentServerApi;


        angular.extend(vm,{
            activities: null,icker,
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
            });
        }

        function activate() {
            _setStrings();
        }

    }

})();
