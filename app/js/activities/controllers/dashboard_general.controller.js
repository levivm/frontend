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

    ActivityGeneralController.$inject = ['$state', '$q', 'filterFilter', 'Elevator', 'Toast', 'Error',
            'activity', 'presaveInfo', 'Analytics', 'serverConf', 'organizer'];

    function ActivityGeneralController($state, $q, filterFilter, Elevator, Toast, Error,
            activity, presaveInfo, Analytics, serverConf, organizer) {

        var vm = this;
        var MAX_LENGTH_SHORT_DESC = 300;

        angular.extend(vm, {
            selected_category: {},
            selected_sub_category: {},
            selected_level: {},
            isCollapsed: true,
            duration: 1,
            isSaving: false,
            activity: angular.copy(activity),
            MAX_LENGTH_SHORT_DESC: MAX_LENGTH_SHORT_DESC,
            selectCategory: selectCategory,
            checkValidTitle: checkValidTitle,
            selectSchedule:selectSchedule,
            getSubmitButtonText: getSubmitButtonText,
            loadAutocompleteTags: loadAutocompleteTags,
            getAmazonUrl: getAmazonUrl,
            organizer:organizer,
            schedulueFixed: true,
            schedulueOpen:false,
            optionsCertificate : [ {value: false, label: 'Sin certificación'},
                                    {value: true, label: 'Con certificación'}]
        });


        _activate();

        /******************ACTIONS**************/

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }

        function createActivity() {
            Error.form.clear(vm.activity_create_form);
            _updateTags();
            _updateSelectedValues();
            vm.activity.create()
                .success(_successCreation)
                .error(_errored);

            function _successCreation(response) {
                vm.isSaving = false;
                if (vm.creating)
                    $state.go('dash.activities-edit.detail', {activity_id : response.id});
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
                console.log("response ",response);

                vm.isCollapsed = false;
                vm.isSaving = false;
                angular.extend(activity, vm.activity);
                _onSectionUpdated();
                Toast.generics.weSaved();
            }
        }


        function selectCategory(category) {
            vm.activity_sub_categories = category.subcategories;
        }

        function getSubmitButtonText(){
            if(activity.id){
                return vm.strings.ACTION_SAVE;
            } else{
                return vm.strings.ACTION_CONTINUE;
            }
        }


        function checkValidTitle(init){

            init = init===true ? true: false;

            if (!vm.creating){
                vm.weHaveTitle = true;
                return;
            }

            if(vm.activity_title){
                vm.activity.title = vm.activity_title;
                vm.weHaveTitle = true;
                Analytics.organizerEvents.newAcitvity(vm.activity.title);
            }else{
                vm.weHaveTitle = false;
                !init ? Toast.error(vm.strings.TOAST_TITLE_ERROR): null;

            }

        }
        
        function selectSchedule(){
            vm.weHaveSchedule = true;
        }
        /*****************SETTERS********************/

        function _setUpdate() {
            vm.save_activity = updateActivity;
            vm.creating = false;
            vm.weHaveTitle = false;
            vm.weHaveSchedule = false;
            _setPreSaveData();

            vm.selected_level = _.find(vm.activity_levels, { 'code': vm.activity.level});
            vm.selected_category = _.find(vm.activity_categories, { 'id': vm.activity.category.id});
            selectCategory(vm.selected_category);
            vm.selected_sub_category = _.find(vm.activity_sub_categories, { 'id': vm.activity.sub_category});
            vm.activity_tags = vm.activity.tags;
            

        }

        function _setCreate() {
            vm.save_activity = createActivity;
            vm.creating = true;
            vm.activity.certification = true;
            vm.activity.is_open=false;
            vm.weHaveSchedule = false;
            _setPreSaveData(presaveInfo);
            vm.selected_level = vm.activity_levels[0];
        }

        function _setPreSaveData(){

            vm.activity_categories = presaveInfo.categories;
            vm.activity_levels = presaveInfo.levels;

        }


        function _updateTags() {
            vm.activity.tags = [];
            angular.forEach(vm.activity_tags, function (value, index) {
                vm.activity.tags.push(value.name);
            });
        }


        function loadAutocompleteTags(){

            var deferred = $q.defer();
            deferred.resolve(presaveInfo.tags);
            return deferred.promise;

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

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                COPY_START_ACTIVITY_CREATION: "¡Comienza a crear tu actividad!",
                COPY_SELECT_ACTIVITY_TITLE: "¿Como titularías esta actividad?",
                COPY_CERTIFICATION: "¿Entregarás certificación?",
                COPY_DESCRIPTION_TOOLTIP: "Describe tu actividad de forma atractiva, especifica y díficil de olvidar.",
                COPY_TAGS_TOOLTIP: "Estas palabras claves facilitarán que tu actividad sea encontrada en la búsqueda.",
                ACTION_CONTINUE: "Continuar",
                ACTION_SAVE: "Guardar",
                OPTION_WITHOUT_CERTIFICATION: "Sin certificación",
                OPTION_WITH_CERTIFICATION: "Con certificación",
                PLACEHOLDER_DESCRIPTION: "Escribe una descripción corta.",
                LABEL_LEVEL: "Nivel",
                LABEL_CATEGORY: "Categoría",
                LABEL_SUB_CATEGORY: "Sub-categoria",
                LABEL_SHOT_DESCRIPTION: "Descripción corta",
                LABEL_TAGS: "Tags / Etiquetas",
                TOAST_TITLE_ERROR: "El título es obligatiorio.",
                SECTION_GENERAL: "General"
            });
        }

        function _activate() {

            Elevator.toTop();
            _setStrings();
            if (activity.id)
                _setUpdate();
            else
                _setCreate();

            vm.checkValidTitle(true);
            console.log(organizer);

            _onSectionUpdated();
        }

        function _onSectionUpdated() {
            activity.updateSection('general');
        }
    }

})();
