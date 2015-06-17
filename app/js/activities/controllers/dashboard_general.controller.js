/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityGeneralController
 * @description ActivityGeneralController
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityGeneralController', ActivityGeneralController);

    ActivityGeneralController.$inject = ['$state', '$q', 'filterFilter', 'Categories', 'Elevator', 'Toast', 'Error',
            'activity', 'presaveInfo'];

    function ActivityGeneralController($state, $q, filterFilter, Categories, Elevator, Toast, Error,
            activity, presaveInfo) {

        var vm = this;

        vm.activity = angular.copy(activity);
        vm.selectCategory = selectCategory;
        vm.setOverElement = setOverElement;
        vm.getLevelClassStyle = getLevelClassStyle;
        vm.checkValidTitle = checkValidTitle;
        vm.getSubmitButtonText = getSubmitButtonText;

        activate();

        /******************ACTIONS**************/

        function createActivity() {
            Error.form.clear(vm.activity_create_form);
            _updateTags();
            _updateSelectedValues();
            vm.activity.create()
                .success(_successCreation)
                .error(_errored);

            function _successCreation(response) {
                vm.isSaving = false;
                if (vm.creating) $state.go('dash.activities-edit.detail', {activity_id : response.id});
                Toast.generics.weSaved("Un paso menos para publicar tu actividad");
            }
        }

        function updateActivity() {
            Error.form.clear(vm.activity_create_form);
            _updateTags();
            _updateSelectedValues();
            vm.activity.update()
                .then(updateSuccess, _errored);

            function updateSuccess(response) {
                vm.isCollapsed = false;
                vm.isSaving = false;
                angular.extend(activity, vm.activity);
                _onSectionUpdated();
                Toast.generics.weSaved();
            }
        }

        function setOverElement(element) {
            vm.currentOverElement = element;
        }

        function getLevelClassStyle(level) {
            return {
                'btn-active' : vm.selected_level.code === level.code,
                'btn-intermediate-level' : level.code === 'I',
                'btn-advanced-level' : level.code === 'A',
                'btn-beginner-level' : level.code === 'P'
            };
        }

        function selectCategory(category) {
            console.log("category", category);
            vm.activity_sub_categories = category.subcategories;
        }

        function getSubmitButtonText(){
            if(activity.id){
                return "Guardar";
            } else{
                return "Continuar";
            }
        }

        function checkValidTitle(){
            if (!vm.creating){
                vm.weHaveTitle = true;
                return;
            }

            if (vm.activity.title != undefined && vm.activity.title != ""){
                var whiteSpaces = 0;
                for (var i = vm.activity.title.length-1; i > 0; i--){
                    if ( vm.activity.title[i] == ' '){
                        whiteSpaces++;
                    }
                }
                vm.weHaveTitle = (whiteSpaces != vm.activity.length);
            } else {
                vm.weHaveTitle = false;
            }
        }

        /*****************SETTERS********************/

        function _setUpdate() {
            vm.save_activity = updateActivity;
            vm.creating = false;
            vm.weHaveTitle = false;
            _setPreSaveInfo(presaveInfo)
                .then(_successLoadActivity);

            function _successLoadActivity(response) {
                vm.selected_level = filterFilter(vm.activity_levels, {code : response.level})[0];
                vm.selected_category = filterFilter(vm.activity_categories, {id : response.category_id})[0];
                vm.selected_sub_category = filterFilter(vm.activity_sub_categories, {id : response.sub_category})[0];
                vm.activity_tags = response.tags;
            }
        }

        function _setCreate() {
            vm.save_activity = createActivity;
            vm.creating = true;            
            vm.activity.certification = undefined;

            _setPreSaveInfo(presaveInfo);
        }

        function _setPreSaveInfo(data) {
            vm.selected_category = {};
            vm.selected_sub_category = {};
            vm.selected_level = {};

            var categories = new Categories(data.categories);
            vm.activity_categories = categories;
            vm.activity_sub_categories = data.subcategories;
            vm.activity_levels = data.levels;

            console.log('_setPreSaveInfo data: ', data);

            vm.loadTags = function () {
                var deferred = $q.defer();
                deferred.resolve(data.tags);
                return deferred.promise;
            };

            var deferred = $q.defer();
            deferred.resolve(vm.activity);
            return deferred.promise;

        }

        function _updateTags() {
            vm.activity.tags = [];
            angular.forEach(vm.activity_tags, function (value, index) {
                vm.activity.tags.push(value.name);
            });
        }

        /*********RESPONSE HANDLERS***************/

        function _updateSelectedValues() {
            vm.activity.category = vm.selected_category.id;
            vm.activity.sub_category = vm.selected_sub_category.id;
            vm.activity.level = vm.selected_level.code;
        }

        function _errored(responseErrors) {
            if (responseErrors) {
                Error.form.add(vm.activity_create_form, responseErrors);
            }

            vm.isSaving = false;
        }

        function activate() {
            vm.isCollapsed = true;
            vm.duration = 1;
            vm.isSaving = false;

            Elevator.toTop();

            if (activity.id)
                _setUpdate();
            else
                _setCreate();

            vm.checkValidTitle();

            _onSectionUpdated();
        }

        function _onSectionUpdated() {
            activity.updateSection('general');
        }
    }

})();