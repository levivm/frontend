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

    OrganizerProfileCtrl.$inject = ['$rootScope', 'uiGmapIsReady', 'serverConf', 'Authentication', 'LocationManager', 'Toast', 'Error',
        'organizer', 'cities'];
    function OrganizerProfileCtrl($rootScope, uiGmapIsReady, serverConf, Authentication, LocationManager, Toast, Error, organizer, cities) {

        var vm = this;
        var SIZE_PICTURE_UP = 2500; //2.5Mb
        angular.extend(vm, {
            organizer : angular.copy(organizer),
            cities : cities,
            photo_path : organizer.photo,
            errors : {},
            photo_invalid : false,
            photo_loading : false,
            isSaving : false,
            map : LocationManager.getMap(organizer.location, true),
            marker : LocationManager.getMarker(organizer.location),
            uploadPicture : uploadPicture,
            submitInfo : submitInfo,
            submitVideo : submitVideo,
            submitLocation : submitLocation
        });

        _activate();

        //--------- Exposed Functions ---------//
        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' + file;
        }
        function uploadPicture(image) {
            if (!image) { return; }
            Error.form.clear(vm.profile_picture_form);
            if(_verifySizePicture(image[0]))
                vm.organizer.upload_photo(image).then(_successUploaded, _errorUpload, _progressUpload);
            else
                Toast.error(vm.strings.TOAST_PICTURE_UPLOAD_ERROR);
        }

        function submitVideo() {
            vm.organizer.update_video().then(_updateSuccess, _updateFail);
        }

        function submitInfo() {
            Error.form.clear(vm.profile_form_info);

            vm.organizer.update_profile().then(_updateSuccess, _updateFail);
        }

        function submitLocation() {
            Error.form.clear(vm.organizer_location_form);
            _setOrganizerPos();
            vm.organizer.update_location(vm.organizer.location).then(_successUpdatedLocation, _updateFail)
        }

        //--------- Internal Functions ---------//

        function _verifySizePicture(pictureToUpload){
            var sizeUpload = pictureToUpload.size / 1000;
            return sizeUpload < SIZE_PICTURE_UP;
        }

        function _progressUpload() {
            vm.photo_loading = true;
        }

        function _errorUpload(response) {
            vm.photo_loading = false;
            var errors = response.data;
            if (errors) {
                vm.photo_invalid = true;
                Error.form.add(vm.profile_picture_form, errors);
            }
        }

        function _successUploaded(response) {
            angular.extend(organizer, response.data);
            angular.extend(vm.organizer, organizer);
            vm.photo_path = response.data.photo;
            vm.photo_invalid = false;
            vm.photo_loading = false;
            Authentication.emitUserChanged();
        }

        function _successUpdatedLocation(response) {
            vm.isSaving = false;
            var city = vm.organizer.location.city
            angular.extend(vm.organizer.location, response.data);
            vm.organizer.location.city = city;
            angular.merge(organizer, vm.organizer);
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
                ACTION_UPDATE_PICTURE: "Cambiar imagen",
                ACTION_VIEW_PROFILE: "Ver Perfil",
                SECTION_PROFILE: "Perfil",
                COPY_PROFILE: "Esta información aparecerá en tu perfil y lo verán los demás usuarios",
                COPY_VIDEO: "¿Posee algún video donde describa o presente su organización?",
                COPY_LOCATION: "¿Donde funciona su organización?",
                COPY_MAP: "Hazle click al pin negro del mapa para desplazarlo a la dirección exacta del lugar donde estás establecido.",
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
                PLACEHOLDER_LOCATION: "¿En donde está tu oficina o realiza la mayoria de tus actividades?",
                HELPER_FULL_NAME: "Escribe el nombre de la organización o persona",
                HELPER_HEADLINE: "Describe tu organización en pocas palabras",
                HELPER_BIO: "Escribe sobre la historia, reputación y calidad de servicios de tu empresa "
                    + "¡En pocas palabras, describe por qué tu empresa es genial!",
                TOAST_PICTURE_UPLOAD_ERROR: "La imágen debe pesar menos de 2.5Mb"
            });
        }

        function _activate(){
            _setStrings();
            _initialize_map();
            vm.marker.options = {draggable:true, icon: getAmazonUrl('static/img/map.png') };
        }

    }

})();
