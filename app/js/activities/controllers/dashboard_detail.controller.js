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
                LABEL_EXTRA_INFO: "Información Importante",
                COPY_POST_ENROLL: "Este mensaje le aparecerá al usuario una vez se haya inscrito a tu actividad."+
                                   "Te recomendamos dejar tu correo electrónico y número de contacto para que pueda contactarte. "+
                                   "Si esta actividad se realiza en varias sedes, deja el numero de contacto de cada sede.",
                PLACEHOLDER_POST_ENROLL: "Mensaje post-inscripción",
                ACTION_SAVE: "Guardar",
                COPY_HELP_TEXT_EXTRA_INFO: "¿Alguna otra información adicional que quieras comunicar "+
                                            "a tus posibles participantes?",
                COPY_HELP_TEXT_REQUIREMETS: "¿Los asistentes necesitan conocimiento/preparación previa en algo? "+
                                            "¿Deben llevar algún tipo de material?",
                COPY_HELP_TEXT_METHODOLOGY: "Si aplica, ¿aplicarás algún método de enseñanza particular? ¿Tu actividad será evaluada? ¿Cómo?",
                COPY_HELP_TEXT_CONTENT: "Si aplica, explica cuáles son los temas a impartir en esta actividad.",
                COPY_HELP_TEXT_GOALS: "¿Cuál es la finalidad de esta actividad? ¿En qué se beneficiarán los asistentes?",
                COPY_HELP_TEXT_AUDIENCE: "¿A quien va dirigida esta actividad?"

            });
        }

        function activate() {

            _setStrings();
            Elevator.toTop();
        }

    }

})();
