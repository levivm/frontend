/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerInstructorsCtrl
 * @description Handles Organizer Instructors Dashboard Section
 * @requires organizer
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerInstructorsCtrl', OrganizerInstructorsCtrl);

    OrganizerInstructorsCtrl.$inject = ['$timeout', 'organizer'];
    function OrganizerInstructorsCtrl($timeout, organizer) {

        var vm = this;
        angular.extend(vm, {
            organizer : organizer,
            instructors : [],
            onChange: onChange
        });

        _activate();

        //--------- Exposed Functions ---------//

        function onChange(){
            $timeout(function(){
                organizer.load().then(result, result);
            }, 0);

            function result(){
                console.log('onChange.vm.instructors:', vm.instructors);
                _setInstructors();
            }
        }

        //--------- Internal Functions ---------//

        function _setInstructors() {
            var EMPTY_INSTRUCTOR = {
                'full_name': null,
                'website': null,
                'bio': null
            };
            var tempInstructor = angular.extend({}, EMPTY_INSTRUCTOR);

            $timeout(function(){
                vm.instructors = angular.copy(organizer.instructors);

                if(!vm.instructors.some(hasEmptySlot)){
                    vm.instructors.unshift(tempInstructor);
                }

                vm.instructors.sort(compare);

                console.log('vm.instructors:', vm.instructors);
                console.log(vm.instructors.length, vm.instructors[0]);
            }, 0);

            function hasEmptySlot(instructor){
                return !instructor.full_name;
            }

            function compare(a, b){
                if (!a.full_name && b.full_name){
                    return -1;
                } else if(a.full_name && !b.full_name){
                    return 1;
                } else {
                    return 0;
                }
            }
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                SECTION_INSTRUCTORS: "Instructores",
                COPY_INSTRUCTORS: "Cuéntanos de cada una de las personas que impartirán la actividad."
            });
        }

        function _activate() {
            _setStrings();
            _setInstructors();
        }

    }

})();