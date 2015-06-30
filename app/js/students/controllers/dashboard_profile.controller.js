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


    StudentProfileCtrl.$inject = ['datepickerPopupConfig', 'Error', 'student','cities', 'Toast','LocationManager'];

    function StudentProfileCtrl(datepickerPopupConfig, Error, student,cities, Toast, LocationManager) {


        var vm = this;

        vm.formats = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        vm.format = vm.formats[0];
        vm.hstep = 1;
        vm.mstep = 15;
        vm.maxStartDate = new Date();
        vm.dateOptions = {
            formatYear: 'yy',
            startingDay: 1
        };
        vm.cities = cities;
        vm.ismeridian = true;
        vm.openDatePicker = openDatePicker;
        vm.selectCity = selectCity;

        vm.bio_max = 140;
        vm.student = student;
        vm.isChangingPicture = false;
        vm.isCollapsed = true;
        vm.photo = null;
        vm.photo_invalid = false;
        vm.photo_loading = false;
        vm.genders = [{id: 1,name:'Femenino' }, {id:2,name:'Masculino'}];
        vm.updateProfile = updateProfile;
        vm.uploadPicture = uploadPicture;
        vm.selectGender  = selectGender;

        vm.isSaving = false;

        initialize();

        //--------- Functions Implementation ---------//

        function updateProfile(){
            Error.form.clear(vm.profile_form);
            vm.student.update_profile().then(updateSuccess, updateError);

            function updateSuccess(){

                Toast.generics.weSaved();

                vm.isSaving = false;
            }
            
            function updateError(response){
                var responseErrors = response.data['form_errors'];
                if (responseErrors) {
                    Error.form.add(vm.profile_form, responseErrors);
                }

                vm.isSaving = false;
            }
            
        }


        function selectCity(city){
            vm.student.city = city.id;
            LocationManager.setCurrentCity(city);
        }

        function selectGender(gender){

            _setGender(gender.id)

        }

        function _setCity(city){

            vm.selected_city = _.find(vm.cities, { 'id': city});

        }

        function _setGender(gender){

            vm.selected_gender = _.find(vm.genders, { 'id': gender});
            vm.student.gender  = gender;
        }


        function uploadPicture(image){
            console.log(image);
            vm.photo_loading = true;
            vm.student.upload_photo(image).then(success, error);

            function success(response){
                vm.student.load(vm.student.id).then(function(){
                    angular.extend(student,vm.student);
                    vm.photo_invalid = false;
                    vm.photo_loading = false;
                });

            }

            function error(response) {
                console.log('StudentProfileCtrl.uploadPicture. Error uploading profile picture');
                var responseErrors = response['errors'];
                vm.photo_loading = false;
                if (responseErrors) {
                    vm.photo_invalid = true;
                    Error.form.add(vm.picture_form, responseErrors);
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

            _setGender(vm.student.gender);
            _setCity(vm.student.city);
            datepickerPopupConfig.showButtonBar = false;

        }

    }

})();