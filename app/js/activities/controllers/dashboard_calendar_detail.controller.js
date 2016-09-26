/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityCalendarController
 * @description Handles Activity Calendar Actions
 * @requires ng.$scope
 * @requires ui.bootstrap.datepicker.datepickerPopupConfig
 * @requires trulii.authentication.services.Error
 * @requires calendar
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityCalendarController', ActivityCalendarController);

    ActivityCalendarController.$inject = ['$scope','$state', '$document', '$timeout', 'activity', 'CalendarsManager', 'calendar', 'Elevator', 'Error', 'datepickerPopupConfig', 'Toast',  'presaveInfo' ];

    function ActivityCalendarController($scope, $state, $document , $timeout, activity, CalendarsManager, calendar, Elevator, Error, datepickerPopupConfig, Toast,  presaveInfo) {

        var vm = this;
        var MAX_LENGTH_NOTE = 200;
        var ERROR_STUDENTS = "No se puede cambiar la sessión con estudiantes inscritos.";
        var packagesErrors = [];
        
        angular.extend(vm, {
            maxLengthNote: MAX_LENGTH_NOTE,
            calendar:  angular.copy(calendar),
            activity: angular.copy(activity),
            countPackages: 0,
            addPackage: addPackage,
            lessPackage: lessPackage,
            presaveInfo: presaveInfo

        });
        activate();
        
        function _createCalendar() {
            Error.form.clear(vm.activity_calendar_form);
            if(_checkIfPackages()){
                Toast.error(vm.strings.ERROR_NON_PACKAGES);
                vm.isSaving = false;
            }else{
                vm.calendar.create()
                    .then(success, _errored);
            }
            
            function success(calendar){
                vm.save_calendar = _updateCalendar;
                CalendarsManager.setCalendar(calendar);
                _onSectionUpdated();

                vm.isCollapsed = false;
                vm.isSaving = false;

            }

        }
        
        function addPackage() {
            var packageEmpty = {
                quantity: 1,
                price: 30000
            };
            vm.calendar.packages.push(packageEmpty);
        }
        
        function lessPackage() {
            vm.calendar.packages.pop();
        }
        


        function _updateCalendar() {
            _clearCalendarForm();
            if(_checkIfPackages()){
                Toast.error(vm.strings.ERROR_NON_PACKAGES);
                vm.isSaving = false;
            }else{
                vm.calendar.update()
                    .then(success, _errored);
            }
            Error.form.clear(vm.activity_calendar_form);
            function success(updatedCalendarData){

                vm.isCollapsed = false;
                angular.extend(calendar,vm.calendar);
                CalendarsManager.setCalendar(updatedCalendarData);
                _onSectionUpdated();

                vm.isSaving = false;

            }
        }
        function _checkIfPackages(){
            return vm.activity.is_open && vm.calendar.packages.length<1;
        }
        
        function _errored(responseErrors) {
            
            
            if (responseErrors) {
                if(responseErrors['packages'] && !responseErrors['schedules']){
                     _.each(responseErrors['packages'], function (error_dict, index) { 
                            var packageError ={};
                            if(!_.isEmpty(error_dict)){
                                _.each(Object.keys(error_dict), function(value){
                                     packageError[value+'_'+index] = error_dict[value];
                                });
                                packagesErrors.push(packageError);
                                Elevator.toElement('package-'+index);
                            }
                        });
                        
                      Error.form.addArrayErrors(vm.activity_calendar_form, packagesErrors);
                }else{
                    Error.form.add(vm.activity_calendar_form, responseErrors);
                    if (!responseErrors['schedules']){
                        Elevator.toElement('activity_calendar_form');
                    }
                }
                
            }
            vm.isSaving = false;
        }

        function _onSectionUpdated() {
            activity.load().then(function (data) {
                activity.updateSection('calendars');

            });
            $state.go("^", {'republish':null});

        }

        function _setStrings(){

            var LABEL_CALENDAR_TITLE = "Nuevo calendario";
            if (vm.calendar.id)
                LABEL_CALENDAR_TITLE = "Calendario > Editar";


            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                LABEL_CALENDARS: "Calendarios",
                LABEL_CALENDAR_TITLE: LABEL_CALENDAR_TITLE,
                COPY_CALENDAR_INFO: "Especifique la información solicitada para continuar.",
                LABEL_IS_FREE: "Marca aquí si la actividad es gratuita.",
                LABEL_START_DATE: "Fecha de inicio",
                LABEL_CLOSE_SALES: "Cierre de ventas",
                TOOLTIP_NOTES: "Escribe información relevante sobre el precio de esta actividad. Ejemplo: el precio incluye los equipos de trabajo",
                LABEL_CALENDAR_SEATS: "Cupos disponibles",
                LABEL_SESSION_PRICE: "Precio (COP)",
                LABEL_NOTES: "Nota",
                LABEL_SALES: "Ventas",
                LABEL_SCHEDULES: "Horarios",
                LABEL_PACKAGE_PRICE: "Precio del plan",
                LABEL_PACKAGE_NAME: "Tipo",
                LABEL_PACKAGE_QUANTITY: "Número",
                LABEL_WEEKEND: "Mi actividad sólo se imparte los fines de semana.",
                COPY_SCHEDULES:"Escribe las fechas, días y horas en las que se realizarán las clases.",
                PLACEHOLDER_SCHEDULES:"Explica con pocas palabras en qué se distingue esta fecha de inicio entre las demás.",
                PLACEHOLDER_NOTES: "Explica con pocas palabras en qué se distingue esta fecha de inicio entre las demás.",
                TITLE_SESSIONS: "Sesiones",
                LABEL_SESSIONS_AMOUNT: "En una misma publicación puedes tener diferentes fechas de inicio, cada una con diferentes número de sesiones, fechas y horas.",
                LABEL_SESSION_DAY: "Día de la sesión",
                LABEL_SESSION_START_TIME: "Hora de inicio:",
                LABEL_SESSION_END_TIME: "Hora de fin:",
                TOAST_SESSIONS_ERROR: "Existe un error en las sesiones",
                TOAST_SESSIONS_NUMBER_ERROR: "Deber haber mínimo una sesión",
                ERROR_NON_PACKAGES: "Debes por lo menos agregar un plan.",
                OPTION_SELECT_PNAME:"Elige un tipo"
            });
        }

        function _clearCalendarForm(){
          for(var i = 0; i < vm.calendar.number_of_sessions; i++){
            if(vm.activity_calendar_form["date_"+i]){
              if(vm.activity_calendar_form["date_"+i].error_message){
                delete vm.activity_calendar_form["date_"+i].error_message;
              }
              if(vm.activity_calendar_form["start_time_"+i]){
                delete vm.activity_calendar_form["start_time_"+i].error_message;
              }
              if(vm.activity_calendar_form["end_time_"+i].error_message){
                delete vm.activity_calendar_form["end_time_"+i].error_message;
              }
            }
          }
        }
        
        function activate() {

            _setStrings();
            vm.isCollapsed = true;
            datepickerPopupConfig.showButtonBar = false;

            vm.formats = ['dd - MM - yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
            vm.format = vm.formats[0];

            vm.hstep = 1;
            vm.mstep = 15;

            vm.minStartDate = new Date();

            vm.dateOptions = {
                formatYear : 'yy',
                startingDay : 1,
                showWeeks: false
            };

            vm.ismeridian = true;

            vm.isSaving = false;

            if (vm.calendar.id){
                vm.save_calendar = _updateCalendar; 
            }
            else{
                vm.save_calendar = _createCalendar;
                vm.calendar.enroll_open=true;
            }
                
            if(!vm.calendar.packages){
                vm.calendar.packages = [];
            }
            $scope.$watch(
              function(scope){
                return scope.calendar.number_of_sessions;
              },
              function(newValue, oldValue){
                if(newValue === 1){
                  $timeout(function(){
                    var scrollElement = angular.element(document.getElementById('calendar-0'));
                    $document.scrollToElementAnimated(scrollElement, -90);
                  });
                }
              }
            );
        }
    }
})();
