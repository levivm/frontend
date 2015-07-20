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
            console.log(vm.profile_form,"FORM");
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
            console.log('selectCity. city:', city);
            if(city){
                vm.student.city = city.id;
                LocationManager.setCurrentCity(city);
            } else {
                console.log('no city selected');
            }
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

        function _setDates(){

            vm.student.birth_date = new Date(student.birth_date)
        }


        function uploadPicture(image){

            if (!image)
                return;
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
                console.log('responseErrors:', responseErrors);
                vm.photo_loading = false;
                if (responseErrors) {
                    vm.photo_invalid = true;
                    Error.form.add(picture_form, responseErrors);
                }
            }
        }

        function openDatePicker($event){
            console.log('openDatePicker');
            $event.preventDefault();
            $event.stopPropagation();

            vm.opened = true;
        }

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REPLACE_PICTURE: "Cambiar foto",
                ACTION_SAVE: "Guardar",
                ACTION_CLOSE: "Cerrar",
                COPY_BIO: "Cuéntanos un poco sobre tí, otros querrán conocerte",
                LABEL_FIRST_NAMES: "Nombres",
                LABEL_BIRTH_DATE: "Fecha de Nacimiento",
                LABEL_LAST_NAMES: "Apellidos",
                LABEL_GENDER: "Género",
                LABEL_CITY: "Ciudad",
                OPTION_SELECT: "Seleccione...",
                SECTION_ACCOUNT: "Cuenta",
                SECTION_PROFILE: "Mi Perfil"
            });
        }

        function initialize() {
            setStrings();
            _setGender(vm.student.gender);
            _setCity(vm.student.city);
            _setDates();
            datepickerPopupConfig.showButtonBar = false;


        }

    }

})();