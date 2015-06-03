(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentProfileController', StudentProfileController);

    StudentProfileController.$inject = ['student'];

    function StudentProfileController(student) {
        var vm = this;

        vm.student = student;
    }
})();