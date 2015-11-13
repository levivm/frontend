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

        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        var vm = this;
        angular.extend(vm, {
            format : FORMATS[0],
            hstep : 1,
            mstep : 15,
            maxStartDate : new Date(),
            dateOptions : {
                formatYear: 'yy',
                startingDay: 1
            },
            cities : cities,
            ismeridian : true,
            bio_max : 140,
            student : student,
            isChangingPicture : false,
            isCollapsed : true,
            photo : null,
            photo_invalid : false,
            photo_loading : false,
            isSaving : false,
            genders : [{id: 1,name:'Femenino' }, {id:2,name:'Masculino'}],
            updateProfile : updateProfile,
            uploadPicture : uploadPicture,
            openDatePicker : openDatePicker,
            selectCity : selectCity,
            selectGender  : selectGender
        });

        _activate();

        //--------- Functions Implementation ---------//

        function updateProfile(){

            console.log("updateProfile.Form:", vm.profile_form);

            if(vm.student.birth_date){
                Error.form.clear(vm.profile_form);
                vm.student.update_profile().then(success, error);
            } else {
                console.log('Student Birth Date undefined');
                var errorResponse = {
                    data: {
                        form_errors: {}
                    }
                };
                errorResponse.data.form_errors[Error.FORM_FIELD_ALL] = [vm.strings.MESSAGE_INVALID_BIRTH_DATE];
                error(errorResponse);
            }

            function success(){
                Toast.generics.weSaved();
                vm.isSaving = false;
            }

            function error(response){
                console.log(response.data);
                var responseErrors = response.data['form_errors'];
                if (responseErrors) {
                    Error.form.add(vm.profile_form, responseErrors);
                }
                vm.isSaving = false;
            }
        }

        function uploadPicture(image){

            if (!image) { return; }
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

        function selectCity(city){
            console.log('selectCity. city:', city);
            vm.student.city = city? city.id : null;
            LocationManager.setCurrentCity(city);
        }

        function _setCity(city){
            vm.selected_city = _.find(vm.cities, { 'id': city});
        }

        function selectGender(gender){
            console.log('selectGender. gender:', gender);
            if(gender){
                var id = gender? gender.id : null;
                _setGender(id);
            } else {
                var form_errors = {};
                form_errors[Error.FORM_FIELD_ALL] = [vm.strings.MESSAGE_EMPTY_GENDER];
                Error.form.add(vm.profile_form, form_errors);
            }
        }

        function _setGender(gender){
            vm.selected_gender = _.find(vm.genders, { 'id': gender});
            vm.student.gender  = gender;
        }

        function _setDates(){
            vm.student.birth_date = new Date(student.birth_date)
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REPLACE_PICTURE: "Cambiar foto",
                ACTION_SAVE: "Guardar",
                ACTION_CLOSE: "Cerrar",
                LABEL_FIRST_NAMES: "Nombres",
                LABEL_BIRTH_DATE: "Fecha de Nacimiento",
                LABEL_LAST_NAMES: "Apellidos",
                LABEL_GENDER: "Género",
                LABEL_CITY: "Ciudad",
                MESSAGE_INVALID_BIRTH_DATE: "Fecha de Nacimiento inválida, por favor introduzca una fecha válida",
                MESSAGE_EMPTY_GENDER: "Por favor introduzca un género",
                OPTION_SELECT: "Seleccione Ciudad",
                SECTION_PROFILE: "Mi Perfil"
            });
        }

        function _activate() {
            _setStrings();
            _setGender(vm.student.gender);
            _setCity(vm.student.city);
            _setDates();
            datepickerPopupConfig.showButtonBar = false;
        }

    }

})();
