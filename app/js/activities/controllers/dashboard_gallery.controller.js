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

    ActivityDBGalleryController.$inject = ['$scope', '$state', '$timeout', '$q', '$modal', '$stateParams',
        'activity', 'UploadFile'];

    function ActivityDBGalleryController($scope, $state, $timeout, $q, $modal, $stateParams, activity, UploadFile) {

        var vm = this;

        initialize();

        vm.activity = angular.copy(activity);
        vm.addImage = _addImage;
        vm.deleteImage = _deleteImage;
        vm.save_activity = _updateActivity;
        vm.setOverElement = _setOverElement;
        vm.showTooltip = _showTooltip;

        /******************ACTIONS**************/

        function _addImage(images,isMain) {

            console.log("images",images);
            //vm.images.concat(images.pop());
            _clearErrors();
            vm.uploading_photo = images.pop();
            //vm.photos.push(images.pop());
            var extra_data = {'main_photo':isMain};
            if (vm.uploading_photo)
                if(isMain){
                    activity.addPhoto(vm.uploading_photo,extra_data)
                        .then(_successUploadedMainPhoto, _erroredUpload, _progressUploadMainPhoto);
                }
                else{

                    activity.addPhoto(vm.uploading_photo,extra_data)
                        .then(_successUploaded, _erroredUpload, _progressUpload);

                }

        }

        function _deleteImage(image) {

            var modalInstance = $modal.open({
                templateUrl : 'partials/activities/messages/confirm_delete_image.html',
                controller : 'ModalInstanceCtrl',
                size : 'lg'
            });

            modalInstance.result.then(function () {
                activity.deletePhoto(image)
                    .then(_successDelete, _erroredDelete)
            });

        }

        function _updateActivity() {

            _clearErrors();
            vm.activity.update()
                .then(_updateSuccess, _errored);
        }

        function _showTooltip(element) {
            return vm.currentOverElement === element;
        }

        function _setOverElement(element) {
            vm.currentOverElement = element;
        }

        /*****************SETTERS********************/

        /*********RESPONSE HANDLERS***************/

        function _updateSuccess(response) {
            vm.isCollapsed = false;
            angular.extend(activity, vm.activity);
            _onSectionUpdated();
        }

        function _successUploaded(response) {
            vm.photo_loading = false;
            vm.images.push(response.data.photo);
            angular.extend(activity.photos,vm.images);
            _onSectionUpdated();
        }

        function _successUploadedMainPhoto(response) {
            vm.main_photo_loading = false;
            vm.main_image = response.data.photo;
            _.remove(activity.photos, 'main_photo', true);
            activity.photos.push(vm.main_image);
            _onSectionUpdated();
        }



        function _progressUploadMainPhoto(response) {
            vm.main_photo_loading = true;
        }



        function _progressUpload(response) {
            vm.photo_loading = true;
        }

        function _erroredUpload(response) {
            vm.photo_loading = false;
            var data = response.data;
            if (data['errors']) {

                angular.forEach(data['errors'], function (errors) {
                    _addError(errors.field, errors.errors[0]);
                });

            } else {

                angular.forEach(data, function (message, field) {
                    _addError(field, message[0]);
                });

            }
        }

        function _successDelete(response) {
            var image_id = response.data.photo_id;

            angular.forEach(vm.images, function (photo, index) {

                if (photo.id == image_id) {
                    vm.images.splice(index, 1);
                }

            });

            _onSectionUpdated();
        }

        function _erroredDelete(response) {
            angular.forEach(response.data, function (message, field) {
                _addError(field, message[0]);
            });
        }

        function _clearErrors() {
            //vm.activity_detail_form.$setPristine();
            vm.errors = null;
            vm.errors = {};
        }

        function _addError(field, message) {
            vm.errors[field] = message;
        }

        function _errored(errors) {

        }

        function _onSectionUpdated() {
            activity.updateSection('gallery');
        }

        function activate() {
            // If the user is authenticated, they should not be here.
        }

        function initialize() {
            vm.errors = {};
            vm.isCollapsed = true;
            vm.uploading_photo = false;            
            vm.images = angular.copy(activity.photos);
            vm.main_image = _.first(_.remove(vm.images, 'main_photo', true));
        }

    }

})();