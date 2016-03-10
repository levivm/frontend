/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentWishlistCtrl
 * @description Handles Student Wishlist Dashboard
 * @requires student
 * @requires trulii.authentication.services.Authentication
 * @requires trulii.authentication.services.Error
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentWishlistCtrl', StudentWishlistCtrl);

    StudentWishlistCtrl.$inject = ['$timeout', 'student', 'Authentication', 'Error', 'Toast'];
    function StudentWishlistCtrl($timeout, student, Authentication, Error, Toast) {

        var vm = this;
        angular.extend(vm, {
            student : student,
            activities:null
        });

        activate();

        //--------- Functions Implementation ---------//

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_WISHLIST: "Favoritos",
            });
        }

        function _setActivities(){
            student.getWishList().then(function(data){
                vm.activities=data.results;
                console.log(vm.activities);
            })
        }

        function activate() {
            _setStrings();
            _setActivities();
        }

    }

})();
