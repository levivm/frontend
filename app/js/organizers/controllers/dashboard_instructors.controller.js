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

    OrganizerInstructorsCtrl.$inject = ['$timeout', 'organizer', 'Toast'];
    function OrganizerInstructorsCtrl($timeout, organizer, Toast) {

        var vm = this;
        var EMPTY_INSTRUCTOR = {
                'full_name': null,
                'website': null,
                'bio': null
            };
        angular.extend(vm, {
            organizer : organizer,
            instructors : [],
            onChange: onChange,
            countInstructors: 0,
            addInstructors:addInstructors,
            removeInstructors:removeInstructors
        });

        _activate();

        //--------- Exposed Functions ---------//

        function onChange(){
            $timeout(function(){
                organizer.load().then(result, result);
            }, 0);

            function result(){
                if(vm.countInstructors>0){
                    vm.countInstructors--;
                }
                _setInstructors();
            }
        }

        //--------- Internal Functions ---------//
        
        function addInstructors() {
            var tempInstructor = angular.extend({}, EMPTY_INSTRUCTOR);
           if(vm.instructors.length<9){
                vm.instructors.unshift(tempInstructor);
                vm.countInstructors++;
            }else{
                Toast.error(vm.strings.TOAST_MAX_ERROR);
            }
            
            vm.countInstructors++;
        }
         function removeInstructors() {
             if(vm.countInstructors > 0){
                 vm.instructors.shift();
                 vm.countInstructors--;
             }
        }
        
        function _loadEmptyInstructors() {
            var i;
            for(i=0; i < vm.countInstructors; i++){
                var tempInstructor = angular.extend({}, EMPTY_INSTRUCTOR);
                vm.instructors.unshift(tempInstructor);
            }
                
        }
        
        function _setInstructors() {
          // var tempInstructor = angular.extend({}, EMPTY_INSTRUCTOR);

            $timeout(function(){
                vm.instructors = angular.copy(organizer.instructors);
                if(vm.countInstructors>0){
                    _loadEmptyInstructors();
                }
             

                vm.instructors.sort(compare);
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
                ACTION_ADD_INSTRUCTORS: "Agregar instructor",
                COPY_INSTRUCTORS: "Administa la información de los instructores de tus actividades. Añade, elimina o edita la información de cada uno.",
                TOAST_MAX_ERROR: "Deben ser máximo 9 instructores"
            });
        }

        function _activate() {
            _setStrings();
            _setInstructors();
        }

    }

})();