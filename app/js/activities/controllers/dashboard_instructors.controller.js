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

    ActivityDBInstructorsController.$inject = ['$scope', '$timeout', 'activity', 'organizer', 'Toast', 'Elevator', 'Error' ];

    function ActivityDBInstructorsController( $scope, $timeout, activity, organizer, Toast, Elevator, Error ) {

        var MAX_INSTRUCTORS = organizer.max_allowed_instructors;

        var vm = this;

        
        var EMPTY_INSTRUCTOR = {
            'full_name': null,
            'website': null,
            'bio': null
        };
        angular.extend(vm, {
            activity : angular.copy(activity),
            isSaving : false,
            organizer : organizer,
            availableInstructors: angular.copy(organizer.instructors),
            updateActivity:updateActivity,
            countInstructors: 0,
            addInstructors:addInstructors,
            removeInstructors:removeInstructors
        });
        _activate();

        //--------- Exposed Functions ---------//


        function updateActivity() {
            Error.form.clear(vm.activity_instructors_forms);
           
           $timeout(function(){
               activity.load().then(result, result);
            }, 0);

            function result(){
                 vm.activity = angular.copy(activity);
                if(vm.countInstructors>0){
                    vm.countInstructors--;
                }
                _setInstructors();
            }
        }
        function addInstructors() {
            var tempInstructor = angular.extend({}, EMPTY_INSTRUCTOR);
            if(vm.instructors.length<4){
                vm.instructors.unshift(tempInstructor);
                vm.countInstructors++;
            }else{
                Toast.error(vm.strings.TOAST_MAX_ERROR);
            }
            
        }
         function removeInstructors() {
             if(vm.countInstructors > 0){
                 vm.instructors.shift();
                 vm.countInstructors--;
             }
        }
        //--------- Internal Functions ---------//

        function _setInstructors() {
            
            var tempInstructor = null;
            /*if(vm.instructors.length < MAX_INSTRUCTORS){
                while(vm.instructors.length < MAX_INSTRUCTORS){
                    tempInstructor = angular.extend({}, EMPTY_INSTRUCTOR);
                    vm.instructors.push(tempInstructor);
                    console.log(vm.instructors.length, vm.instructors[vm.instructors.length-1]);
                }
            }
            console.log('vm.activity.instructors:', vm.activity.instructors);
            console.log('vm.instructors:', vm.instructors);*/
            
            $timeout(function(){
                 vm.instructors = angular.copy(vm.activity.instructors);
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
        
         function _loadEmptyInstructors() {
            var i;
            for(i=0; i < vm.countInstructors; i++){
                var tempInstructor = angular.extend({}, EMPTY_INSTRUCTOR);
                vm.instructors.unshift(tempInstructor);
            }
                
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                SECTION_INSTRUCTORS: "Instructores",
                COPY_INSTRUCTORS: "Cuéntanos de cada una de las personas que impartirán la actividad.",
                ACTION_ADD_INSTRUCTORS: "Agregar instructor",
                TOAST_MAX_ERROR: "Deben ser máximo 4 instructores"
            });
        }

        function _activate() {
            _setStrings();
            Elevator.toTop();
            _setInstructors();
            $scope.$on('changeInstructor', function(event){
                console.log('changeInstructor');
                Elevator.toTop();
            })
        }

    }

})();
