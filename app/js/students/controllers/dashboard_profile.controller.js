/**
 * @ngdoc controller
 * @name trulii.students.controllers.StudentProfileCtrl
 * @description ActivityDashboardCtrl
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.students.controllers')
        .controller('StudentProfileCtrl', StudentProfileCtrl);

    StudentProfileCtrl.$inject = ['datepickerPopupConfig', 'Error', 'student'];

    function StudentProfileCtrl(datepickerPopupConfig, Error, student) {

        var vm = this;

        vm.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[0];
        vm.hstep = 1;
        vm.mstep = 15;
        vm.minStartDate = new Date();
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        vm.ismeridian = true;
        vm.openDatePicker = openDatePicker;

        vm.bio_max = 140;
        vm.student = student;
        vm.isChangingPicture = false;
        vm.errors = {};
        vm.isCollapsed = true;
        vm.photo = null;
        vm.photo_invalid = false;
        vm.photo_loading = false;
        vm.genders = [{name:'Femenino', id: 1}, {name:'Masculino', id: 2}];
        vm.updateProfile = updateProfile;
        vm.uploadPicture = uploadPicture;
        vm.getPicture = vm.student.getPicture();

        initialize();

        //--------- Functions Implementation ---------//

        function updateProfile(){
            vm.errors = Error.form.clear(vm.profile_form, vm.errors);
            vm.student.update_profile().then(updateSuccess, updateError);

            function updateSuccess(){}
            
            function updateError(response){
                var responseErrors = response.data['form_errors'];
                if (responseErrors) {
                    vm.errors = Error.form.add(vm.profile_form, vm.errors, responseErrors);
                }
            }
        }

        function uploadPicture(image){
            console.log(image);
            vm.student.upload_photo(image).then(success, error);

            function success(response){
                angular.extend(student,vm.student);
                vm.photo_invalid = false;
                vm.photo_loading = false;
            }

            function error(response) {
                console.log('StudentProfileCtrl.uploadPicture. Error uploading profile picture');
                var responseErrors = response['errors'];
                vm.photo_loading = false;
                if (responseErrors) {
                    vm.photo_invalid = true;
                    vm.errors = Error.form.add(vm.picture_form, vm.errors, responseErrors);
                }
            }
        }

        function openDatePicker($event){
            console.log('openDatePicker');
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        }

        function initialize() {
            datepickerPopupConfig.showButtonBar = false;
        }

    }

})();