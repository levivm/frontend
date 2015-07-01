/**
 * Register controller
 * @namespace thinkster.organizers.controllers
 */
(function () {
    'use strict';


    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileCtrl', OrganizerProfileCtrl);

    OrganizerProfileCtrl.$inject = ['$timeout', 'uiGmapIsReady', 'LocationManager', 'Toast', 'Error',
        'organizer', 'cities'];
    /**
     * @namespace RegisterController
     */
    function OrganizerProfileCtrl($timeout, uiGmapIsReady, LocationManager, Toast, Error, organizer, cities) {

        var vm = this;

        vm.organizer = angular.copy(organizer);
        vm.cities = cities;
        vm.photo_path = vm.organizer.photo;
        vm.errors = {};
        vm.photo_invalid = false;
        vm.photo_loading = false;
        vm.isCollapsed = true;
        vm.load_map = initialize_map;
        vm.map = LocationManager.getMap(vm.organizer.location);
        vm.marker = LocationManager.getMarker(vm.organizer.location);
        vm.uploadPicture = uploadPicture;
        vm.submit_info = update_info;
        vm.submit_video = update_video;
        vm.submit_location = update_location;
        vm.isSaving = false;

        activate();

        function uploadPicture(image) {
            vm.organizer.upload_photo(image)
                .then(_successUploaded, _erroredUpload, _progressUpload);
        }

        function update_video() {
            vm.organizer.update_video()
                .then(_updateSuccess, _updateFail);
        }

        function _progressUpload() {
            vm.photo_loading = true;
        }

        function _erroredUpload(response) {
            vm.photo_loading = false;
            if (response['errors']) {
                vm.photo_invalid = true;
                angular.forEach(response['errors'], function (errors) {
                    _addError(errors.field, errors.errors[0]);
                });
            }
        }

        function _successUploaded(response) {
            angular.extend(organizer, response.data);
            angular.extend(vm.organizer, organizer);
            vm.photo_path = response.data.photo;
            vm.photo_invalid = false;
            vm.photo_loading = false;
        }

        function update_info() {
            vm.organizer.update_profile()
                .then(_updateSuccess, _updateFail);
        }

        function update_location() {
            Error.form.clear(vm.profile_form_info);
            _setOrganizerPos();
            vm.organizer.update_location(vm.organizer.location)
                .then(_successUpdatedLocation, _updateFail)
        }

        function _successUpdatedLocation(response) {
            angular.extend(organizer, vm.organizer);
            Toast.generics.weSaved();
        }

        function _setOrganizerPos() {
            vm.organizer.location.point = [];
            vm.organizer.location.point[0] = vm.marker.coords.latitude;
            vm.organizer.location.point[1] = vm.marker.coords.longitude;
        }


        function initialize_map() {
            uiGmapIsReady.promise(1).then(function (instances) {
                instances.forEach(function (inst) {
                    var map = inst.map;
                    google.maps.event.trigger(map, 'resize');
                });
            });
        }

        function _updateSuccess() {
            angular.extend(organizer, vm.organizer);
            //Authentication.updateAuthenticatedAccount();
            _toggleMessage();
            vm.isSaving = false;
            Toast.generics.weSaved();
        }

        function _updateFail(response) {
            var errors = response.data;
            Error.form.add(vm.profile_form_info, errors);
            vm.isSaving = false;
        }

        function _toggleMessage() {
            vm.isCollapsed = false;
            var timer = $timeout(function () {
                vm.isCollapsed = true;
            }, 1000);
        }

        function setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SAVE: "Guardar",
                ACTION_DELETE: "Eliminar",
                ACTION_UPDATE_PICTURE: "Cambiar Foto",
                SECTION_PROFILE: "Mi Perfil",
                TAB_INFO: "Información",
                TAB_VIDEO: "Video",
                TAB_LOCATION: "Ubicación",
                TAB_COMMENTS: "Comentarios",
                LABEL_FULL_NAME: "Nombre Completo",
                LABEL_BIO: "Biografía",
                HELPER_FULL_NAME: "Escribe el nombre de la organización o persona",
                HELPER_BIO: "Escribe sobre la historia, reputación y calidad de servicios de tu empresa "
                + "¡En pocas palabras, describe por qué tu empresa es genial!"
            });
        }

        function activate(){
            setStrings();
            console.log('organizer:', organizer);
            console.log('vm.map:', vm.map);
            console.log('vm.marker:', vm.marker);
        }

    }

})();