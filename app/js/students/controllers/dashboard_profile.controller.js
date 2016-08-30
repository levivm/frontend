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


    StudentProfileCtrl.$inject = ['$rootScope', 'datepickerPopupConfig', 'Authentication', 'Error', 'Toast','LocationManager','student','cities' ];

    function StudentProfileCtrl($rootScope, datepickerPopupConfig, Authentication, Error, Toast, LocationManager, student, cities) {

        var FORMATS = ['dd-MM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        var vm = this;
        var SIZE_PICTURE_UP = 2500; //2.5Mb
        angular.extend(vm, {
            format : FORMATS[0],
            hstep : 1,
            mstep : 15,
            maxStartDate : new Date(),
            dateOptions : {
                formatYear: 'yyyy',
                startingDay: 1,
                showWeeks:false,
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

            //console.log("updateProfile.Form:", vm.profile_form);
           Error.form.clear(vm.profile_form);
            vm.student.update_profile().then(success, error);

            function success(){
                Toast.generics.weSaved();
                vm.isSaving = false;
            }

            function error(response){
                var responseErrors = response.data.user ? response.data.user : response.data;
                if (responseErrors)
                    Error.form.add(vm.profile_form, responseErrors);
                vm.isSaving = false;
            }
        }

        function uploadPicture(image){

            if (!image) { return; }
            vm.photo_loading = true;

            if(_verifySizePicture(image[0])){
              vm.student.upload_photo(image).then(success, error);
            }else{
              Toast.error(vm.strings.TOAST_PICTURE_UPLOAD_ERROR);
              vm.photo_loading = false;
            }


            function success(response){
                vm.student.load(vm.student.id).then(function(){
                    angular.extend(student,vm.student);
                    vm.photo_invalid = false;
                    vm.photo_loading = false;
                });
                Authentication.emitUserChanged();

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
            vm.student.birth_date = student.birth_date ;
        }

        function _verifySizePicture(pictureToUpload){
            var sizeUpload = pictureToUpload.size / 1000;
            return sizeUpload < SIZE_PICTURE_UP;
        }
        
        function _setFullName(){
            vm.student.fullName= vm.student.user.first_name+' '+vm.student.user.last_name;
        }
        
        function _setTelephone(){
            vm.student.telephone = Number(vm.student.telephone);
            vm.student.telephone = vm.student.telephone==0 ? undefined : vm.student.telephone;
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_REPLACE_PICTURE: "Cambiar imagen",
                ACTION_SAVE: "Guardar",
                ACTION_CLOSE: "Cerrar",
                LABEL_FIRST_NAMES: "Nombres",
                LABEL_BIRTH_DATE: "Fecha de nacimiento",
                LABEL_LAST_NAMES: "Apellidos",
                LABEL_GENDER: "Género",
                LABEL_CITY: "¿En qué ciudad vives?",
                LABEL_TELEPHONE: "Teléfono",
                COPY_PRIVATE_DATA_TOOLTIP: "Esta información no la compartiremos con nadie.",
                MESSAGE_INVALID_BIRTH_DATE: "Fecha de Nacimiento inválida, por favor introduzca una fecha válida",
                MESSAGE_EMPTY_GENDER: "Por favor introduzca un género",
                OPTION_SELECT: "Seleccione Ciudad",
                OPTION_GENDER_SELECT: "Seleccione un Genero",
                BIRTH_SELECT: "Seleccione una fecha", 
                SECTION_PROFILE: "Perfil",
                COPY_PROFILE: "Esta información aparecerá en tu perfil y lo veran los demás usuarios.",
                TOAST_PICTURE_UPLOAD_ERROR: "La imágen debe pesar menos de 2.5Mb"
            });
        }

        function _activate() {
            _setStrings();
            _setGender(vm.student.gender);
            _setCity(vm.student.city);
            _setDates();
            _setFullName();
            _setTelephone();
            datepickerPopupConfig.showButtonBar = false;
        }

    }

})();
