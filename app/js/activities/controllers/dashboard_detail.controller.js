/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDBDetailController
 * @description ActivityDBDetailController
 * @requires ng.$scope
 * @requires trulii.activities.services.Activity
 * @requires activity
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDBDetailController', ActivityDBDetailController);


    ActivityDBDetailController.$inject = ['$state', '$timeout', '$q', 'activity', 'Elevator', 'Toast', 'Error'];

    function ActivityDBDetailController($state, $timeout, $q, activity, Elevator, Toast, Error) {

        var vm = this;

        angular.extend(vm,{
            activity: angular.copy(activity),
            save_activity: _updateActivity,
            setOverElement: _setOverElement,
            showTooltip: _showTooltip,
            errors: {},
            isCollapsed: true,
            isSaving: false,
        });

        activate();

        /******************ACTIONS**************/

        function _updateActivity() {
            vm.isSaving = true;

            Error.form.clear(vm.activity_detail_form);

            vm.activity.update()
                .then(_updateSuccess, _errored);
        }

        function _showTooltip(element) {
            return vm.currentOverElement == element;
        }

        function _setOverElement(element) {
            vm.currentOverElement = element;
        }

        /*****************SETTERS********************/

        /*********RESPONSE HANDLERS***************/

        function _updateSuccess(response) {
            vm.isCollapsed = false;
            vm.isSaving = false;
            angular.extend(activity, vm.activity);
            _onSectionUpdated();

            Toast.generics.weSaved();

        }

        function _errored(errors) {
            vm.isSaving = false;
            Error.form.add(vm.activity_detail_form, errors);
        }

        function _onSectionUpdated() {
            activity.updateSection('detail');
        }


        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                TITLE_DETAIL: "Detalles",
                COPY_DETAIL: "Completa estos campos si deseas ser más preciso.",
                LABEL_AUDIENCE: "Audiencia",
                LABEL_GOALS: "Objetivos",
                LABEL_CONTENT: "Contenido",
                LABEL_METHODOLOGY: "Metodología",
                LABEL_REQUIREMENTS: "Requerimientos",
                LABEL_EXTRA_INFO: "Información Extra",
                COPY_POST_ENROLL: "Mensaje que se le mostrará al usuario una vez se inscriba en la actividad",
                PLACEHOLDER_POST_ENROLL: "Mensaje post inscripción",
                ACTION_SAVE: "Guardar",
                COPY_HELP_TEXT_EXTRA_INFO: "¿Alguna otra información adicional que quieras comunicar "+
                                            "a tus posibles participantes?",
                COPY_HELP_TEXT_REQUIREMETS: "¿Para inscribirse hace falta conocimientos previos en algún tema? "+
                                            "¿Deben llevar algún material para realizar la actividad? ¿Se requiere " +
                                            "algunar documentación?",
                COPY_HELP_TEXT_METHODOLOGY: "¿Aplicarás algún método de enseñanza en particular? "+
                                            "¿Su actividad será evaluadad? ¿Cómo?",
                COPY_HELP_TEXT_CONTENT: "¿Cuáles son los temas que impartirá en su actividad?",
                COPY_HELP_TEXT_GOALS: "¿Cuál es la finalidad de su actividad?",
                COPY_HELP_TEXT_AUDIENCE: "¿A que tipo de personas va dirigido su actividad? "+
                                         "¿Profesionales o público en general?"

            });
        }

        function activate() {

            _setStrings();
            Elevator.toTop();
        }

    }

})();
