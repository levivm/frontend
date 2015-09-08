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
        
        angular.extend(vm, {
            success : false,
            calendar : null,
            activity : null,
            capacity : null,
            amount : null,
            quantity : 0,
            assistants : [],
            minus : minus,
            plus : plus,
            enroll : enroll,
            isAnonymous : isAnonymous,
            //checkCardNumber : checkCardNumber,
            checkCardExpiry : checkCardExpiry,
            getCardType: getCardType,
            cardData : {
                "name_card": "APPROVED",
                "identificationNumber": "32144457",
                "number": "4111111111111111",
                exp_month: 1,
                exp_year: 2017,
                cvv: null,
                "method": ""
            } 
        });

        var isValidDate = false;
        //var isValidNumber = false;

        _activate();

        //--------- Exposed Functions ---------//

        //function checkCardNumber(){
        //    Error.form.clear(vm.enrollForm);
        //    //vm.cardData.number = vm.cardData.number.replace(/-|\s/g,"");
        //    Payments.validateCardNumber().then(success, error);
        //
        //    function success(isValid){
        //        console.log("checkCardNumber. isValid:", isValid);
        //        if(isValid){
        //            isValidNumber = true;
        //        } else {
        //            //TODO i18n
        //            isValidNumber = false;
        //            Error.form.add(vm.enrollForm, {'invalidNumber': ["Número inválido. Por favor verifique "
        //            + "el número en su tarjeta"]});
        //        }
        //    }
        //
        //    function error(){
        //        console.log("Couldn't validate card number");
        //        isValidNumber = false;
        //        Error.form.add(vm.enrollForm, {'invalidNumber': ["No se pudo validar su número de tarjeta"
        //        + ", por favor intente de nuevo"]});
        //    }
        //}




        function getCardType(){
            Payments.validateCardType(vm.cardData.number).then(success, error);

            function success(cardType){
                console.log("card type:", cardType);
                vm.cardData.method = cardType;

            }
            function error(){
                vm.cardData.method = null;
                console.log("Couldn't check card type");
            }
        }

        function checkCardExpiry(){


            Error.form.clear(vm.enrollForm);
            
            var card = vm.cardData;
            
            if(card.exp_year && card.exp_month){
                Payments.validateExpiryDate(card.exp_year, card.exp_month).then(success, error);

            }

            function success(isValid){
                console.log("checkCardExpiry. isValid:", isValid);

                if(isValid){
                    isValidDate = true;
                    Error.form.clearField(vm.enrollForm,'invalidExpiry');
                } else {
                    isValidDate = false;
                    Error.form.add(vm.enrollForm, {'invalidExpiry': ["Fecha de Vencimiento inválida"]});

                }
            }
            function error(){
                console.log("Couldn't validate card expiry date");
                isValidDate = false;
                Error.form.add(vm.enrollForm, {'invalidExpiry': ["Fecha de Vencimiento inválida"]});
            }

        }

        function enroll() {
            Error.form.clear(vm.enrollForm);

            StudentsManager.getCurrentStudent().then(getStudentSuccess, getStudentError);

            function getStudentSuccess(student){
                vm.cardData[Payments.KEY_PAYER_ID] = student.id;
                var exp_month = vm.cardData.exp_month;
                var exp_year  = vm.cardData.exp_year;
                vm.cardData.expirationDate = [exp_month, exp_year].join('/');


                var card = vm.cardData;

                Payments.validateExpiryDate(card.exp_year, card.exp_month)
                    .then(successCheckCardExpiry,errorCheckCardExpiry);

            }



            function getStudentError(response){
                console.log("Error getting current logged student:", response);
            }


            function successCheckCardExpiry(isValid){
                
                isValidDate = true;

                Error.form.clearField(vm.enrollForm,'invalidExpiry');
                Payments.validateCardType(vm.cardData.number)
                        .then(validateCardTypeSuccess,validateCardTypeError);

            }

            function errorCheckCardExpiry(response){

                console.log("Couldn't validate card expiry date");
                isValidDate = false;
                Error.form.add(vm.enrollForm, {'invalidExpiry': ["Fecha de Vencimiento inválida"]});

            }


            function validateCardTypeSuccess(cardType){

                Error.form.clearField(vm.enrollForm,'cardMethod');
                Error.form.clearField(vm.enrollForm,'generalError');

                var cardData = _.clone(vm.cardData);

                Payments.getToken(cardData).then(getTokenSuccess, getTokenError);

            }

            function validateCardTypeError(){

                Error.form.add(vm.enrollForm, {'cardMethod': ["Tipo de tarjeta inválido"]});
                console.log("Couldn't check card type");

            }


            function getTokenSuccess(response){
                var token = response[Payments.KEY_TOKEN];
                var cardNumber = vm.cardData.number;
                var last_four_digits  = cardNumber.substr(cardNumber.length -4);
                var buyer = {};
                buyer[Payments.KEY_NAME] = response[Payments.KEY_NAME];
                buyer[Payments.KEY_EMAIL] = currentUser.user.email;


                var data = {
                    activity: activity.id,
                    chronogram: calendar.id,
                    token: token,
                    amount: vm.quantity * calendar.session_price,
                    quantity: vm.quantity,
                    assistants: vm.assistants,
                    buyer: buyer,
                    last_four_digits: last_four_digits,
                    payment_method: Payments.KEY_CC_PAYMENT_METHOD
                };
                data[Payments.KEY_CARD_ASSOCIATION] = response[Payments.KEY_METHOD];

                ActivitiesManager.enroll(activity.id, data).then(_enrollSuccess, _enrollError);

                function _enrollSuccess(response) {
                    calendar.addAssistants(response.assistants);
                    vm.success = true;
                    $state.go('activities-enroll.success');
                }

                function _enrollError(response){
                    var error = response.data;
                    if (!(error.assistants))
                        Error.form.add(vm.enrollForm, {'generalError': [error]});
                    else
                        Error.form.addArrayErrors(vm.enrollForm, error.assistants);
                }
            }

            function getTokenError(errors){


                var isPayUError = !!errors.error;

                if (isPayUError){
                    Error.form.add(vm.enrollForm, {'generalError':["Error"]});
                    return;
                }


                _.forEach(errors,addError);


                function addError(error){

                    var form_error = {};
                        form_error[error] = ["Campo requerido"];
                    Error.form.add(vm.enrollForm, form_error);


                }

                console.log("Couldn't get token from Pay U", errors);
            }

            function checkCardType(){
                Error.form.clear(vm.enrollForm);

                Payments.validateCardType(vm.cardData.number).then(success, error);

                function success(cardType){

                }
                function error(){
                    Error.form.add(vm.enrollForm, {'cardMethod': ["Tipo de tarjeta inválido"]});
                    console.log("Couldn't check card type");
                }

            }

        }

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

        //--------- Internal Functions ---------//

        function _calculateAmount() {
            vm.amount = vm.quantity * calendar.session_price;
        }

        function _isAllBooked(){
            return calendar.capacity <= calendar.assistants.length;
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
                COPY_RELEASE: "Haciendo click en \"Inscribir\" estoy de acuerdo con el monto total a cancelar,"
                    + " el cual incluye la comisión de la plataforma de pago,"
                    + " y con los Términos y Condiciones de Trulii",
                ACTION_LOGIN: "Inicia Sesion",
                ACTION_REGISTER: "Regístrate",
                ACTION_ENROLL: "Inscribir",
                ACTION_RETURN: "Volver a Actividad",
                COPY_ASSISTANT_NUMBER: "Asistente #",
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
                LABEL_CARD_HOLDER: "Nombre del Titular (Sobre la tarjeta)",
                PLACEHOLDER_CARD_HOLDER: "Nombre en la tarjeta",
                LABEL_CARD_NUMBER:"Número de tarjeta",
                PLACEHOLDER_CARD_NUMBER: "Número de tarjeta",
                LABEL_EXPIRY_DATE : "Fecha de Expiración",
                LABEL_MONTH: "Mes",
                PLACEHOLDER_MONTH: "MM",
                LABEL_YEAR: "Año",
                PLACEHOLDER_YEAR: "YYYY",
                LABEL_CVV:"CVV",
                PLACEHOLDER_CVV:"CVV"
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