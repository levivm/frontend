/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDBGalleryController
 * @description ActivityDBGalleryController
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDBGalleryController', ActivityDBGalleryController);

    ActivityDBGalleryController.$inject = ['$q', '$modal', 'activity', 'ActivitiesManager', 'Toast', 'Elevator'];

    function ActivityDBGalleryController($q, $modal, activity, ActivitiesManager ,Toast, Elevator) {

        var vm = this;
        var SIZE_PICTURE_UP = 2500; //2.5Mb

        angular.extend(vm, {
            activity : angular.copy(activity),
            picture: null,
            pictures: null,
            selectedCover: null,
            coverToUpload: null,
            isCurrentCoverPreview: true,
            setCoverPreview: setCoverPreview,
            getSelectedCoverUrl: getSelectedCoverUrl,
            setActivityCover: setActivityCover,
            uploadActivityCover: uploadActivityCover,
            addGalleryPicture: addGalleryPicture,
            deletePicture : deletePicture,
            updateActivity : updateActivity
        });

        _activate();

        //--------- Exposed Functions ---------//

        function setCoverPreview(cover){
            vm.selectedCover = cover;
            vm.isCurrentCoverPreview = (vm.selectedCover === vm.activityCover);
        }

        function getSelectedCoverUrl(){
            if(!vm.selectedCover){ return null;}
            return 'url(' + vm.selectedCover.photo + ')';
        }

        function uploadActivityCover(pictures) {
            console.log("uploadActivityCover. pictures:", pictures);
            if (!pictures) { return; }

            var pictureToUpload = pictures.pop();
            console.log(pictureToUpload);
            if (pictureToUpload){
                if(_verifySizePicture(pictureToUpload)){
                  var extra_data = { 'main_photo': true };
                  vm.activity.addPicture(pictureToUpload, extra_data)
                  .then(_coverUploadSuccess, _uploadError, _coverUploadProgress);
                }else {
                  Toast.error(vm.strings.TOAST_COVER_UPLOAD_ERROR);
                }
            } else {
                console.log('uploadActivityCover. No picture selected');
            }
        }

        function setActivityCover(){
            console.log('cover:', vm.selectedCover);
            if (!vm.selectedCover) { return; }
            vm.activity.setStockCover(vm.selectedCover).then(_coverUploadSuccess, _uploadError, _coverUploadProgress);
        }

        function addGalleryPicture(pictures){
            console.log("_addPicture. pictures:", pictures);
            if (!pictures) { return; }

            var pictureToUpload = pictures.pop();

            if (pictureToUpload){
                if(_verifySizePicture(pictureToUpload)){
                  var extra_data = { 'main_photo': false };
                  vm.activity.addPicture(pictureToUpload, extra_data).then(uploadSuccess, uploadError, uploadProgress);

                }else{
                  Toast.error(vm.strings.TOAST_GALLERY_UPLOAD_ERROR_SIZE);
                }
            } else {
                console.log('addGalleryPicture. No picture specified');
            }

            function uploadSuccess(response) {
                vm.isLoadingGalleryPicture = false;
                vm.pictures.push(response.data.picture);
                vm.activity.pictures.push(response.data.picture);
                // angular.extend(vm.activity.pictures, vm.pictures);
                angular.extend(activity, vm.activity);
                _onSectionUpdated();
                Toast.success(vm.strings.TOAST_GALLERY_UPLOAD_SUCCESS);
            }

            function uploadProgress() {
                vm.isLoadingGalleryPicture = true;
            }

            function uploadError(response) {
                vm.isLoadingGalleryPicture = false;
                vm.isLoadingCover = false;
                console.log('Error uploading gallery picture.', response.data);
                Toast.error(vm.strings.TOAST_GALLERY_UPLOAD_ERROR);
            }
        }

        function deletePicture(picture) {
            var modalInstance = $modal.open({
                templateUrl : 'partials/activities/messages/confirm_delete_image.html',
                controller : 'ModalInstanceCtrl',
                controllerAs:'modal',
                size : 'lg'
            });
            modalInstance.result.then(function () {
                vm.activity.deletePicture(picture).then(success, error);
            });

            function success(response) {
                var image_id = parseInt(response.data.photo_id);

                _.remove(vm.pictures,{'id':image_id});
                _.remove(vm.activity.pictures,{'id':image_id});

                angular.extend(activity, vm.activity);



                Toast.info(vm.strings.TOAST_GALLERY_DELETE_SUCCESS);
                _onSectionUpdated();
            }

            function error(response) {
                console.log('Error deleting gallery picture.', response.data);
                Toast.error(vm.strings.TOAST_GALLERY_DELETE_ERROR);
            }
        }

        function updateActivity() {
            vm.isSaving = true;
            vm.activity.update().then(success, error);

            function success() {
                vm.isCollapsed = false;
                angular.extend(activity, vm.activity);
                vm.isSaving = false;
                _onSectionUpdated();
                Toast.generics.weSaved();
            }

            function error(response){
                console.log('Error updating activity.', response.data);
            }
        }

        //--------- Internal Functions ---------//

        function _coverUploadSuccess(response) {
          console.log(response);
            vm.isLoadingCover = false;
            _.remove(vm.activity.pictures, 'main_photo', true);
            vm.activity.pictures.push(response.data.picture);
            angular.extend(activity, vm.activity);

            _initializePictures();
            _onSectionUpdated();

            Toast.success(vm.strings.TOAST_COVER_SET_SUCCESS);
        }

        function _coverUploadProgress() {
            vm.isLoadingCover = true;
        }

        function _uploadError(response) {
            vm.isLoadingGalleryPicture = false;
            vm.isLoadingCover = false;
            console.log('Error uploading picture.', response.data);
            Toast.error(vm.strings.TOAST_COVER_SET_ERROR);
        }

        function _onSectionUpdated() {
            activity.updateSection('gallery');
        }

        function _initializePictures(){
            vm.pictures = _.filter(vm.activity.pictures, 'main_photo', false);
            vm.activityCover = _.first(_.remove(angular.copy(vm.activity.pictures), 'main_photo', true));
            _getSubcategoryCoverPool().then(success);

            function success(){
                console.log(vm.activityCover);
                if(vm.activityCover){
                    vm.covers.unshift(vm.activityCover);
                    vm.selectedCover = vm.activityCover;
                }
            }
        }

        function _getSubcategoryCoverPool(){
            var deferred = $q.defer();

            ActivitiesManager.getSubcategoryCovers(vm.activity.sub_category).then(success, error);
            return deferred.promise;

            function success(covers){
                vm.covers = covers;
                deferred.resolve();
            }
            function error(){
                console.log("Couldn't retrieve covers for activity subcategory");
                deferred.reject();
            }
        }
        function _verifySizePicture(pictureToUpload){
            var sizeUpload = pictureToUpload.size / 1000;
            return sizeUpload < SIZE_PICTURE_UP;
        }
        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTION_SET_AS_COVER: "Usar como Portada",
                ACTION_CHANGE_COVER: "Cambiar portada",
                LABEL_REQUIRED: "(Obligatorio)",
                LABEL_COVER: "Foto de portada",
                COPY_COVER: "Trata que la foto sea de buena calidad y en donde aparezcas tú impartiendo la actividad."
                    + "En caso que no tengas te ofrecemos estas:",
                COPY_COVER_ALREADY_SET: "Esta es tu portada actual",
                ACTION_UPLOAD_COVER: "Subir portada",
                COPY_MAX_WIDTH_COVER: "Medidas: 1100x800px con un peso máximo de 2.5Mb por foto",
                COPY_MAX_WIDTH_GALLERY: "Medidas: 800x600x con un peso máximo de 2.5Mb por foto",
                COPY_UPLOAD_COVER: "Encuentra y selecciona alguna foto dentro de tus archivos.",
                LABEL_COVER_FROM_STOCK: "Portada Express",
                COPY_COVER_FROM_STOCK: "Si no tienes foto de portada, nosotros tenemos un botón mágico para ti ",
                LABEL_GALLERY_TITLE: "Galería",
                LABEL_GALLERY_ADD_IMAGE: "Añadir Imagen",
                COPY_GALLERY: "Añade más fotos de varias actividades que hayas impartido. Esto te ayudará a aumentar tus ventas y a generar más confianza.",
                COPY_MAX_IMAGE_ERROR: "Ya posee el ḿáximo de imágenes que puede tener para una actividad.",
                LABEL_VIDEO_TITLE: "Video",
                COPY_VIDEO: "Agrega un video corto, sencillo y de buena calidad que hable de tu actividad.",
                LABEL_YOUTUBE_LINK: "Enlace de Youtube",
                PLACEHOLDER_YOUTUBE_LINK: "Pega aqui el enlace al video de tu actividad",
                ACTION_SAVE_ACTIVITY: "Guardar",
                TOAST_COVER_SET_SUCCESS: "Portada agregada exitosamente",
                TOAST_COVER_SET_ERROR: "No se pudo asignar la portada. Por favor intente de nuevo",
                TOAST_GALLERY_UPLOAD_SUCCESS: "Imagen agregada exitosamente a la galería",
                TOAST_GALLERY_UPLOAD_ERROR: "No se pudo cargar la imagen en la galería. Por favor intente de nuevo",
                TOAST_GALLERY_UPLOAD_ERROR_SIZE: "La imagen de la galería debe pesar menos de 2.5Mb",
                TOAST_GALLERY_DELETE_ERROR: "No se pudo eliminar la imagen de la galería. Por favor intente de nuevo",
                TOAST_GALLERY_DELETE_SUCCESS: "Imagen eliminada exitosamente de la galería",
                TOAST_COVER_UPLOAD_ERROR: "La imagen del cover debe pesar menos de 2.5Mb"

            });
        }

        function _activate() {
            _setStrings();
            _initializePictures();
            console.log("Activity",vm.activity);
            vm.errors = {};
            vm.isCollapsed = true;
            vm.isLoadingGalleryPicture = false;
            vm.isLoadingCover = false;
            vm.isSaving = false;
            Elevator.toTop();
        }
    }
})();
