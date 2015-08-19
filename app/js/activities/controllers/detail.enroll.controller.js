(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailEnrollController', ActivityDetailEnrollController);

    ActivityDetailEnrollController.$inject = ['$state', '$timeout','ActivitiesManager', 'StudentsManager', 'Payments', 'Authentication', 'Toast', 'Error',
        'activity', 'calendar', 'currentUser'];

    function ActivityDetailEnrollController($state, $timeout, ActivitiesManager, StudentsManager, Payments, Authentication, Toast, Error,
                                            activity, calendar, currentUser) {

        var vm = this;

        vm.success = false;
        vm.calendar = null;
        vm.activity = null;
        vm.capacity = null;
        vm.amount = null;
        vm.quantity = 0;
        vm.assistants = [];

        vm.minus = minus;
        vm.plus = plus;
        vm.enroll = enroll;
        vm.isAnonymous = isAnonymous;

        _activate();

        function isAnonymous(){
            return !Authentication.isAuthenticated();
        }

        function minus() {
            if (vm.quantity > 1) {
                vm.quantity -= 1;
                vm.assistants.pop();
                _calculateAmount();
            }
        }

        function plus() {
            if (vm.quantity + vm.calendar.assistants.length < vm.capacity) {
                vm.quantity += 1;
                vm.assistants.push({});
                _calculateAmount();
            } else {
                Toast.warning('El máximo de cupos disponibles es ' + vm.quantity);
            }
        }

        function enroll() {
            _clearErrors();
            StudentsManager.getCurrentStudent().then(getStudentSuccess, getStudentError);

            function getStudentSuccess(student){
                var data = {
                    "payerId": student.id,
                    "name": "APPROVED",
                    "identificationNumber": "32144457",
                    "paymentMethod": "VISA",
                    "number": "4111111111111111",
                    "expirationDate": "2017/01"
                };
                Payments.getToken(data).then(getTokenSuccess, getTokenError);
            }

            function getStudentError(response){
                console.log("Error getting current logged student:", response)
            }

            function getTokenSuccess(response){
                console.log('token response:', response);
                var token = response[Payments.KEY_CREDIT_CARD_TOKEN][Payments.KEY_CREDIT_CARD_TOKEN_ID];
                var maskedNumber = response[Payments.KEY_CREDIT_CARD_TOKEN][Payments.KEY_MASKED_NUMBER];
                var cardAssociation = response[Payments.KEY_CREDIT_CARD_TOKEN][Payments.KEY_PAYMENT_METHOD];
                var buyer = {};
                buyer[Payments.KEY_NAME] = response[Payments.KEY_CREDIT_CARD_TOKEN][Payments.KEY_NAME];
                buyer[Payments.KEY_EMAIL] = currentUser.user.email;
                var data = {
                    activity: activity.id,
                    chronogram: calendar.id,
                    token: token,
                    amount: vm.quantity * calendar.session_price,
                    quantity: vm.quantity,
                    assistants: vm.assistants,
                    buyer: buyer
                };
                data[Payments.KEY_MASKED_NUMBER] = maskedNumber;
                data[Payments.KEY_CARD_ASSOCIATION] = cardAssociation;

                ActivitiesManager.enroll(activity.id, data).then(_enrollSuccess, _enrollError);

                function _enrollSuccess(response) {
                    calendar.addAssistants(response.assistants);
                    vm.success = true;
                    $state.go('activities-enroll.success');
                }

                function _enrollError(errors){
                    Error.form.addArrayErrors(vm.enrollForm, errors.assistants);
                }
            }
            function getTokenError(error){
                console.log("Couldn't get token from Pay U", error);
            }
        }

        function _calculateAmount() {
            vm.amount = vm.quantity * calendar.session_price;
        }

        function _isAllBooked(){
            return calendar.capacity <= calendar.assistants.length;
        }

        function _clearErrors() {
            Error.form.clear(vm.enrollForm);
        }

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                COPY_SIGN_UP: "¿Quieres inscribirte en esta actividad?",
                COPY_ONE_MORE_STEP: "¡Estás a un paso! ",
                COPY_NO_ACCOUNT: "¿No tienes cuenta en Trulii? ¡No hay problema! ",
                COPY_UNTIL_NOW: "Hasta ahora",
                COPY_NO_ASSISTANTS: "esta actividad no tiene asistentes ¡Sé tú el primero!",
                COPY_ONE_ASSISTANT: "va 1 asistente ¡Faltas tú!",
                COPY_MANY_ASSISTANTS: "van {} asistentes ¡Faltas tú!",
                COPY_RELEASE: "Haciendo click en \"Pagar\" estoy de acuerdo con el monto total a cancelar,"
                    + " el cual incluye la comisión de la plataforma de pago,"
                    + " y con los Términos y Condiciones de Trulii",
                ACTION_LOGIN: "Inicia Sesion",
                ACTION_REGISTER: "Regístrate",
                ACTION_ENROLL: "Inscribir",
                ACTION_RETURN: "Volver a Actividad",
                COPY_CONGRATULATIONS: "¡Felicidades!",
                COPY_ASSISTANT_NUMBER: "Asistente #",
                ACTION_VIEW_PROFILE: "Ver Perfil",
                LABEL_ORGANIZER: "Organizador",
                LABEL_ASSISTANTS: "Asistentes",
                LABEL_ACTIVITY_INFO: "Información de la Actividad",
                LABEL_START_DATE: "Fecha de Inicio",
                LABEL_NUMBER_OF_SESSIONS: "Nro. de Sesiones",
                LABEL_AVAILABLE_SEATS: "Cupos Restantes",
                LABEL_PRICE: "Precio",
                LABEL_QUANTITY: "Cantidad",
                LABEL_TOTAL: "Total",
                LABEL_SCHEDULES: "Cronogramas",
                LABEL_FIRST_NAME: "Nombre",
                LABEL_LAST_NAME: "Apellido",
                LABEL_EMAIL: "Email",
                LABEL_PAYMENT_INFO: "Información de Pago",
                LABEL_SAVE_PAYMENT_INFO: "Deseo guardar los datos de mi tarjeta para próximas inscripciones",
            });
        }

        function _activate(){
            _setStrings();
            vm.stateInfo = {
                from: {
                    state : $state.current.name,
                    params : $state.params
                }
            };

            vm.success = false;

            vm.calendar = calendar;
            vm.activity = activity;

            vm.capacity = calendar.capacity;
            vm.amount = calendar.session_price;

            if(_isAllBooked()){
                vm.quantity = 0;
                vm.assistants = [];
            } else {
                vm.quantity = 1;
                if(vm.calendar.hasAssistantByEmail(currentUser.user.email)){
                    console.log('Usuario ya esta inscrito');
                    vm.assistants = [{}];
                } else {
                    vm.assistants = [angular.extend({}, currentUser.user)];
                }
            }
        }
    }
})();