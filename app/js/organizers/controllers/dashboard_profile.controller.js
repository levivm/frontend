/**
 * @ngdoc controller
 * @name trulii.organizers.controllers.OrganizerProfileCtrl
 * @description Handles Organizer Account Dashboard section
 * @requires ng.$timeout
 * @requires uiGmapgoogle-maps.directives.api.utils.uiGmapIsReady
 * @requires trulii.locations.services.LocationManager
 * @requires trulii.ui-components.services.Toast
 * @requires trulii.utils.services.Error
 * @requires organizer
 * @requires cities
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileCtrl', OrganizerProfileCtrl);

    OrganizerProfileCtrl.$inject = ['$timeout', 'uiGmapIsReady', 'LocationManager', 'Toast', 'Error',
        'organizer', 'cities'];
    function OrganizerProfileCtrl($timeout, uiGmapIsReady, LocationManager, Toast, Error, organizer, cities) {

        var vm = this;
        angular.extend(vm, {
            organizer : angular.copy(organizer),
            cities : cities,
            photo_path : organizer.photo,
            errors : {},
            photo_invalid : false,
            photo_loading : false,
            isSaving : false,
            map : LocationManager.getMap(organizer.location),
            marker : LocationManager.getMarker(organizer.location),
            uploadPicture : uploadPicture,
            submit_info : update_info,
            submit_video : update_video,
            submit_location : update_location
        });

        _activate();

        //--------- Exposed Functions ---------//

        function uploadPicture(image) {
            if (!image) { return; }
            vm.organizer.upload_photo(image).then(_successUploaded, _errorUpload, _progressUpload);
        }

        function update_video() {
            vm.organizer.update_video()
                .then(_updateSuccess, _updateFail);
        }

        function update_info() {
            Error.form.clear(vm.profile_form_info);

            vm.organizer.update_profile()
                .then(_updateSuccess, _updateFail);
        }

        function update_location() {
            Error.form.clear(vm.organizer_location_form);
            _setOrganizerPos();
            vm.organizer.update_location(vm.organizer.location)
                .then(_successUpdatedLocation, _updateFail)
        }

        //--------- Internal Functions ---------//

        function _progressUpload() {
            vm.photo_loading = true;
        }

        function _errorUpload(response) {
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

        function _successUpdatedLocation(response) {
            vm.isSaving = false;
            angular.extend(organizer, vm.organizer);
            Toast.generics.weSaved();
        }

        function _updateSuccess() {
            angular.extend(organizer, vm.organizer);
            vm.isSaving = false;
            Toast.generics.weSaved();
        }

        function _updateFail(response) {
            var errors = response.data;
            Error.form.add(vm.organizer_location_form, errors);
            Error.form.add(vm.profile_form_info, errors);
            vm.isSaving = false;
        }

        function _setOrganizerPos() {
            vm.organizer.location.point = [];
            vm.organizer.location.point[0] = vm.marker.coords.latitude;
            vm.organizer.location.point[1] = vm.marker.coords.longitude;
        }

        function _initialize_map() {
            uiGmapIsReady.promise(1).then(function (instances) {
                instances.forEach(function (inst) {
                    var map = inst.map;
                    google.maps.event.trigger(map, 'resize');
                    vm.map.control.refresh(vm.map.center);
                });
            });
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_SAVE: "Guardar",
                ACTION_DELETE: "Eliminar",
                ACTION_UPDATE_PICTURE: "Cambiar Foto",
                ACTION_VIEW_PROFILE: "Ver Perfil",
                SECTION_PROFILE: "Perfil",
                COPY_PROFILE: "Esta información aparecerá en tu perfil y lo verán los demás usuarios",
                COPY_VIDEO: "¿Posee algún video donde describa o presente su organización?",
                COPY_LOCATION: "¿Donde funciona su organización?",
                SUB_SECTION_VIDEO: "Video",
                SUB_SECTION_LOCATION: "Ubicación",
                SUB_SECTION_COMMENTS: "Comentarios",
                LABEL_FULL_NAME: "Nombre Completo",
                LABEL_BIO: "Biografía",
                LABEL_HEADLINE: "Descripción Corta",
                LABEL_VIDEO: "Dirección en Youtube del vídeo",
                LABEL_CITY: "Ciudad",
                LABEL_ADDRESS: "Dirección Exacta",
                OPTION_SELECT: "Seleccione...",
                PLACEHOLDER_VIDEO: "Ejemplo: www.youtube.com/watch?v=video_id",
                HELPER_FULL_NAME: "Escribe el nombre de la organización o persona",
                HELPER_HEADLINE: "Describe tu organización en pocas palabras",
                HELPER_BIO: "Escribe sobre la historia, reputación y calidad de servicios de tu empresa "
                + "¡En pocas palabras, describe por qué tu empresa es genial!"
            });
        }

        function _activate(){
            _setStrings();
            _initialize_map();
        }

    }

})();
