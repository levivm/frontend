/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDBInstructorsController
 * @description ActivityDBInstructorsController
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDBInstructorsController', ActivityDBInstructorsController);

    ActivityDBInstructorsController.$inject = ['activity', 'organizer', 'Toast', 'Elevator', 'Error'];

    function ActivityDBInstructorsController(activity, organizer, Toast, Elevator, Error) {

        var MAX_INSTRUCTORS = organizer.max_allowed_instructors;

        var vm = this;

        vm.isSaving = false;
        vm.activity = angular.copy(activity);
        vm.availableInstructors = angular.copy(organizer.instructors);
        vm.organizer = organizer;
        vm.updateActivity = updateActivity;

        _activate();

        //--------- Exposed Functions ---------//


        function updateActivity() {
            Error.form.clear(vm.activity_instructors_forms);
            angular.extend(activity, vm.activity);
        }

        //--------- Internal Functions ---------//

        function _setInstructors() {
            var EMPTY_INSTRUCTOR = {
                'full_name': null,
                'website': null,
                'bio': null
            };
            var tempInstructor = null;
            vm.instructors = angular.copy(vm.activity.instructors);
            if(vm.instructors.length < MAX_INSTRUCTORS){
                while(vm.instructors.length < MAX_INSTRUCTORS){
                    tempInstructor = angular.extend({}, EMPTY_INSTRUCTOR);
                    vm.instructors.push(tempInstructor);
                    console.log(vm.instructors.length, vm.instructors[vm.instructors.length-1]);
                }
            }
            console.log('vm.activity.instructors:', vm.activity.instructors);
            console.log('vm.instructors:', vm.instructors);
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                SECTION_INSTRUCTORS: "Instructores",
                COPY_INSTRUCTORS: "Cuéntanos de cada una de las personas que impartirán la actividad."
            });
        }

        function _activate() {
            _setStrings();
            Elevator.toTop();
            _setInstructors();
            activity.getInstructors().then(function(instructors){
                console.log('activity.getInstructors:', instructors);
            });

        }

    }

})();
