/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityCalendarsController
 * @description ActivityCalendarsController
 * @requires ng.$scope
 * @requires trulii.activities.services.Activity
 * @requires activity
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityCalendarsController', ActivityCalendarsController);

    ActivityCalendarsController.$inject = ['$rootScope', '$scope', '$state', '$stateParams', '$filter', '$modal',
        'CalendarsManager','activity', 'calendars','Toast', 'Elevator'];

    function ActivityCalendarsController($rootScope, $scope, $state, $stateParams, $filter, $modal,
                                         CalendarsManager, activity, calendars,Toast, Elevator) {

        var vm = this;
        var DETAIL_STATE = '.detail';
        var stateChangeUnbinder = null;

        angular.extend(vm, {

            republish: false,
            activity:activity,
            calendars: calendars,
            createCalendar: createCalendar,
            loadCalendar: loadCalendar,
            setCalendar: setCalendar,
            deleteCalendar: deleteCalendar,
            hideCalendars:hideCalendars,
            changeSchedule: changeSchedule,
            checkNoMoreCalendars: checkNoMoreCalendars,
            calendar_errors: {}

        });

        _activate();

        function createCalendar() {
            $state.go(DETAIL_STATE, {'calendar_id' : null});
        }

        function loadCalendar(calendar) {
            $state.go(DETAIL_STATE, {'calendar_id' : calendar.id});
        }

        function setCalendar(calendar) {
            activity.load().then(function (data) {
                _onSectionUpdated();
            });

            $state.go("^");
        }
        
        function hideCalendars() {
            if(vm.activity.isOpen){
                document.getElementById('slider-anchor').setAttribute('disabled', true);
            }
            else{
                document.getElementById('slider-anchor').removeAttribute('disabled');
            }
        }
        
        function changeSchedule(value){
            if(vm.calendars.length>0){
                Toast.error(vm.strings.ERROR_SCHEDULE);
            }
            else{
                vm.activity.is_open = value;
                vm.activity.update()
                    .then(updateSuccess, _errored);
            }
            function updateSuccess(response) {
                angular.extend(activity, vm.activity);
            }
            
            function _errored(response) {
                console.log(response);
            }
                
                
        }
        
        function checkNoMoreCalendars() {
            return !(vm.calendars.length>0 && vm.activity.is_open);
        }

        function deleteCalendar(calendar) {
            if (calendar.hasAssistants()){
                Toast.error(vm.strings.DELETE_CALENDAR_ERROR);
                return;
            }

            var modalInstance = $modal.open({
                templateUrl : 'partials/activities/messages/confirm_delete_calendar.html',
                controller : 'ModalInstanceCtrl',
                controllerAs:'modal',
                size : 'lg'
            });

            modalInstance.result.then(function () {
                CalendarsManager.deleteCalendar(calendar).then(success, error);
            });

            function success() {
                activity.load().then(function (activityData){
                    _onSectionUpdated();
                });
            }

            function error(response) {
                vm.calendar_errors = {};
                //TODO Repasar como adaptar a Error
                if(response.detail){
                    Toast.error(response.detail);
                    return;
                }
                angular.forEach(response, function (value, key) {
                    vm.calendar_errors[key] = value;
                });
            }
        }

        function _hasNewCalendar(){
            var today = new Date();
            console.group('hasNewCalendar');
            var result = calendars.some(hasValidCalendar);
            console.groupEnd();

            return result;

            function hasValidCalendar(calendar){
                console.log('calendar:', calendar);
                return calendar.initial_date >= today;
            }
        }

        function _onSectionUpdated() {
            activity.updateSection('calendars');
        }

        function _setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                DELETE_CALENDAR_ERROR: "No puede eliminar este calendario, tiene estudiantes inscritos, contactanos",
                LABEL_CALENDARS: "Calendarios",
                LABEL_CALENDAR_OPEN: "Calendario abierto",
                LABEL_CALENDAR_CLOSED: "Calendario fijo",
                LABEL_START_DATE: "Calendario ",
                LABEL_CLOSE_SALE: "Ventas cerradas",
                LABEL_OPEN_SALE: "Ventas abiertas",
                LABEL_CALENDAR_SEATS: "Cupos",
                LABEL_PACKAGES: "Paquetes",
                LABEL_PACKAGES_PLAN: "Número de planes",
                LABEL_START: "Fecha de inicio",
                LABEL_END: "Última sesión",
                LABEL_FREE: "Gratis",
                LABEL_EDIT_CALENDAR: "Editar",
                LABEL_DELETE_CALENDAR: "Borrar",
                LABEL_ADD_CALENDAR: "Agregar calendario",
                COPY_ADD_CALENDAR_CLOSE: "Tu actividad tiene una fecha de inicio específica y la persona no podrá inscribirse una vez esta comience.",
                COPY_ADD_CALENDAR_OPEN: "Tu actividad es recurrente durante todas las semanas, sin tener fecha de inicio específica.",
                COPY_REPUBLISH_CALENDAR: "Estás republicando esta actividad. Recuerda que para republicarla exitosamente debes" +
                                         "de agregar por lo menos un nuevo calendario.",
                LABEL_WARNING: "Advertencia!",
                ERROR_SCHEDULE: "No puedes cambiar a otro tipo de calendario en esta publicación mientras tengas creados calendarios del otro tipo."
            });
        }

        function _activate() {
            _setStrings();
            vm.republish = $stateParams.republish;
            vm.calendar_errors = {};
            _onSectionUpdated();
            stateChangeUnbinder = $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    if(isCreatingCalendar()){
                        CalendarsManager.loadCalendars(activity.id).then(function(dataCalendars){
                          Elevator.toTop();
                          vm.calendars= dataCalendars;
                        });
                    } else {
                        if(vm.republish){

                            event.preventDefault();
                            if(_hasNewCalendar()){
                                doTransition();
                            } else {
                                var modalInstance = $modal.open({
                                    templateUrl : 'partials/activities/messages/confirm_leave_republish.html',
                                    controller : 'ModalInstanceCtrl',
                                    controllerAs:'modal',
                                    size : 'md'
                                });
                                modalInstance.result.then(success, error);
                            }
                        }
                    }

                    // success function for Republish Exit Modal Ok/COntinue Button
                    function success(response) {
                        doTransition();
                    }

                    // error function for Republish Exit Modal Cancel/GO Back Button
                    function error(response) {
                        console.log('Republish exiting. User chose to stay and republish');
                    }

                    function isCreatingCalendar(){
                        return (toState.name === (fromState.name + DETAIL_STATE)) || fromState.name === 'dash.activities-edit.calendars.detail';
                    }

                    function doTransition(){
                        stateChangeUnbinder();
                        $state.go(toState, toParams);
                    }
                }
            );

            $scope.$on('$destroy', stateChangeUnbinder);
            Elevator.toTop();
        }

    }

})();
