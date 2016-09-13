/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDBReturnPDashboard
 * @description ActivityDBReturnPDashboard
 * @requires ng.$scope
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDBReturnPDashboard', ActivityDBReturnPDashboard);

    ActivityDBReturnPDashboard.$inject = ['$scope', 'activity', 'Toast', 'Error', 'Elevator'];

    function ActivityDBReturnPDashboard($scope, activity, Toast, Error, Elevator) {

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
            Error.form.clear(vm.activity_return_policy_form);
            vm.activity.update()
                .then(_updateSuccess, _errored);

            vm.isSaving = true;
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

            angular.extend(activity, vm.activity);
            vm.isCollapsed = false;
            _onSectionUpdated();
            vm.isSaving = false;

            Toast.generics.weSaved();
        }

        function _errored(errors) {
            Error.form.add(vm.activity_return_policy_form, errors);
            _onSectionUpdated();
            vm.isSaving = false;
        }

        function _onSectionUpdated() {
            activity.updateSection('return-policy');
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                TITLE_RETURN_POLICY: "Políticas de Devolución",
                COPY_RETURN_POLICY: "Escribe tus condiciones para reembolsar al asistente el pago que hizo por la insripción."
                                    +  "Si no aceptas reembolso, también ponlo, o en caso contrario aplicarán los terminos de trulii.",
                LABEL_RETURN_POLICY: "Política de Devolución",
                PLACEHOLDER_RETURN_POLICY: "Condiciones para reembolso",
                ACTION_SAVE: "Guardar",
            });
        }
        function activate() {
            _setStrings();
            Elevator.toTop();
        }

    }

})();