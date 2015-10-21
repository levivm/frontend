/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDetailEnrollController
 * @description Controller for Activity Detail Enroll Component. Handles
 * calendar sign ups and related payments.
 * @requires ui.router.state.$state
 * @requires ng.$window
 * @requires ng.$sce
 * @requires trulii.activities.services.ActivitiesManager
 * @requires trulii.students.services.StudentsManager
 * @requires trulii.payments.services.Payments
 * @requires trulii.authentication.services.Authentication
 * @requires trulii.ui-components.services.Toast
 * @requires trulii.utils.services.Error
 * @requires activity
 * @requires calendar
 * @requires currentUser
 * @requires deviceSessionId
 * @requires trulii.utils.services.defaultPicture
 * @requires trulii.utils.services.defaultCover
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailEnrollController', ActivityDetailEnrollController);

    ActivityDetailEnrollController.$inject = ['$state', '$window', '$sce', 'ActivitiesManager',
        'StudentsManager', 'Payments', 'Authentication', 'Toast', 'Error', 'activity', 'calendar', 'currentUser',
        'deviceSessionId', 'defaultPicture', 'defaultCover'];

    function ActivityDetailEnrollController($state, $window, $sce, ActivitiesManager,
                                            StudentsManager, Payments, Authentication, Toast, Error,
                                            activity, calendar, currentUser, deviceSessionId, defaultPicture, defaultCover) {

        var vm = this;
        var isValidDate = false;

        angular.extend(vm, {
            success : false,
            loading_banks_list:false,
            paymentWithPse : false,
            hasCouponApplied: false,
            calendar : null,
            activity : null,
            capacity : null,
            amount : null,
            showTerms : false,
            showReimbursement : false,
            quantity : 0,
            assistants : [],

            addAssistant : addAssistant,
            removeAssistant: removeAssistant,
            enroll : enroll,
            isAnonymous : isAnonymous,
            getOrganizerPhoto: getOrganizerPhoto,
            appendPayUUniqueId: appendPayUUniqueId,
            checkCardExpiry : checkCardExpiry,
            getCardType: getCardType,
            changePSEPaymentMethod: changePSEPaymentMethod,
            changeCCPaymentMethod: changeCCPaymentMethod,
            enrollPSE: enrollPSE,
            toggleTerms : toggleTerms,
            toggleReimbursement : toggleReimbursement,

            cardData : {
                "name_card": "APPROVED",
                "identificationNumber": "32144457",
                "number": "4111111111111111",
                exp_month: 1,
                exp_year: 2017,
                cvv: null,
                "method": ""
            },
            pseFormData: {
                "banksList": [],
                "userTypes":[
                    {'description':'Natural','value':'N'},
                    {'description':'Juridica','value':'J'}
                ],
                "idTypes":[
                    {'description':'Cédula de ciudadanía','value':'CC'},
                    {'description':'Cédula de extranjería','value':'CE'},
                    {'description':'N.I.T','value':'NIT'},
                    {'description':'Tarjeta de Indentidad','value':'TI'},
                    {'description':'Pasaporte','value':'PP'},
                    {'description':'Identificador único de cliente','value':'IDC'},
                    {'description':'Número Móvil','value':'CEL'},
                    {'description':'Registro civil de nacimiento','value':'RC'},
                    {'description':'Documento de identificación extranjero','value':'DE'}
                ]
            },
            pseData: {}
        });

        console.log("sessionID", deviceSessionId);

        _activate();

        //--------- Exposed Functions ---------//

        /** PSE Payments Methods **/

        function changePSEPaymentMethod(){
            Error.form.resetForm(vm.enrollForm);
            vm.paymentWithPse = true;
            loadAvailableBanks();

            function loadAvailableBanks(){
                vm.loading_banks_list = true;
                Payments.getAvailablePSEBanks().then(success,error).finally(stopLoader);

                function success(response){
                    vm.pseFormData.banksList = response;
                }

                function error(response){
                    Error.form.add(vm.enrollForm, {'bank':["Error al cargar  los bancos disponibles"]});
                    return {};
                }

                function stopLoader(){
                    vm.loading_banks_list = false;
                }
            }
        }

        function changeCCPaymentMethod(){
            Error.form.resetForm(vm.enrollForm);
            vm.paymentWithPse = false;
        }

        function enrollPSE(){
            Error.form.clear(vm.enrollForm);
            Error.form.clearField(vm.enrollForm,'generalError');

            StudentsManager.getCurrentStudent().then(getStudentSuccess, getStudentError);

            function getStudentSuccess(student){
                var buyer = {};
                buyer[Payments.KEY_NAME]  = vm.pseData.name;
                buyer[Payments.KEY_PAYER_EMAIL] = vm.pseData.payerEmail;
                buyer[Payments.KEY_CONTACT_PHONE] = vm.pseData.contactPhone;

                var bank = vm.pseData.selectedBank ? vm.pseData.selectedBank.pseCode : null;
                var userType = vm.pseData.selectedUserType ? vm.pseData.selectedUserType.value : null;
                var idType = vm.pseData.selectedIdType ? vm.pseData.selectedIdType.value : null;
                var idNumber = vm.pseData.idNumber;

                var buyer_pse_data = {
                     response_url: Payments.PAYU_RESPONSE_URL,
                     bank: bank,
                     userType: userType,
                     idType: idType,
                     idNumber: idNumber
                };

                var data = {
                    activity: activity.id,
                    chronogram: calendar.id,
                    amount: vm.quantity * calendar.session_price,
                    quantity: vm.quantity,
                    assistants: vm.assistants,
                    buyer: buyer,
                    buyer_pse_data:buyer_pse_data,
                    payment_method: Payments.KEY_PSE_PAYMENT_METHOD,

                };

                ActivitiesManager.enroll(activity.id, data).then(_enrollSuccess, _enrollError);

                function _enrollSuccess(response) {
                    vm.success = true;
                    var bank_url = response.data.bank_url;
                    $window.location.href = bank_url;
                }

                function _enrollError(response){
                    var errors = response.data;
                    if (!(errors.assistants))
                        Error.form.add(vm.enrollForm, errors);
                    else
                        Error.form.addArrayErrors(vm.enrollForm, errors.assistants);
                }
            }

            function getStudentError(response){
                console.log("Error getting current logged student:", response);
            }
        }

        /** -----/ PSE Payments Methods **/

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
            Error.form.clearField(vm.enrollForm,'generalError');

            if(vm.paymentWithPse){
                enrollPSE();
            } else {
                StudentsManager.getCurrentStudent().then(getStudentSuccess, getStudentError);
            }

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
                    deviceSessionId : deviceSessionId,
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
                        Error.form.add(vm.enrollForm, error);
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

        function removeAssistant(index) {
            if (vm.quantity > 1) {
                vm.quantity -= 1;
                vm.assistants.splice(index, 1);
                _calculateAmount();
            } else {
                Toast.warning('Es necesario al menos un asistente a inscribir');
            }
        }

        function addAssistant() {
            if (vm.quantity + vm.calendar.assistants.length < vm.capacity) {
                vm.quantity += 1;
                vm.assistants.push({});
                _calculateAmount();
            } else {
                Toast.warning('El máximo de cupos disponibles es ' + vm.quantity);
            }
        }

        function getOrganizerPhoto(){
            if(vm.activity.organizer && !!vm.activity.organizer.photo){
                return vm.activity.organizer.photo;
            } else {
                return defaultPicture;
            }
        }

        function appendPayUUniqueId(url){
            var user_id = Payments.CC_USER_ID;
            var payUUniqueId = deviceSessionId + user_id;
            return  $sce.trustAsResourceUrl(url + payUUniqueId);
        }

        function toggleTerms(){
            vm.showTerms = !vm.showTerms;
        }

        function toggleReimbursement(){
            vm.showReimbursement = !vm.showReimbursement;
        }

        //--------- Internal Functions ---------//

        function _calculateAmount() {
            vm.amount = vm.quantity * calendar.session_price;
        }

        function _isAllBooked(){
            return calendar.capacity <= calendar.assistants.length;
        }

        function _mapMainPicture(activity){
            if(activity.pictures.length > 0){
                angular.forEach(activity.pictures, function(picture, index, array){
                    if(picture.main_photo){
                        activity.main_photo = picture.photo;
                    }

                    if( index === (array.length - 1) && !activity.main_photo){
                        activity.main_photo = array[0].photo;
                    }
                });
            } else {
                activity.main_photo = defaultCover;
            }
            return activity;
        }

        function _mapVacancy(calendar){
            calendar.vacancy = calendar.capacity - calendar.assistants.length;
            calendar.total_price = calendar.session_price * calendar.sessions.length;
            return calendar;
        }

        function _setAssistants() {
            if(_isAllBooked()) {
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

        function _setStrings() {
            if (!vm.strings) {
                vm.strings = {};
            }
            angular.extend(vm.strings, {
                ACTION_LOGIN: "Inicia Sesion",
                ACTION_REGISTER: "Regístrate",
                ACTION_ENROLL: "Confirmar Inscripción",
                ACTION_VIEW_RETURN_POLICY: "Ver Políticas de Reembolso del Organizador",
                ACTION_RETURN: "Volver a Actividad",
                ACTION_ADD_ASSISTANT: "Agregar Asistente",
                ACTION_VIEW_TERMS: "Términos y Condiciones de Trulii",
                COPY_ASSISTANT_NUMBER: "Asistente #",
                COPY_ASSISTANTS: "Agrega la información de las personas que asistiran a la actividad",
                COPY_STARTING_ON: "Con inicio el",
                COPY_VACANCY: " Vacantes",
                COPY_TO: " a ",
                COPY_COVER: "Usted desea inscribir",
                COPY_SIGN_UP: "¿Quieres inscribirte en esta actividad?",
                COPY_ONE_MORE_STEP: "¡Estás a un paso! ",
                COPY_NO_ACCOUNT: "¿No tienes cuenta en Trulii? ¡No hay problema! ",
                COPY_UNTIL_NOW: "Hasta ahora",
                COPY_RELEASE: "Haciendo click en \"Inscribir\" estoy de acuerdo con el monto total a cancelar,"
                + " el cual incluye la comisión de la plataforma de pago,"
                + " y con los",
                LABEL_ORGANIZER: "Organizador",
                LABEL_ASSISTANTS: "Asistentes",
                LABEL_ACTIVITY_INFO: "Información de la Actividad",
                LABEL_ACTIVITY_SESSIONS: "Sesiones",
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

                LABEL_ID_NUMBER:"Número de identificación",
                LABEL_CLIENT_NAME_LAST_NAME:"Nombres y Apellidos",
                LABEL_BANK:"Banco",
                OPTION_BANK_DEFAULT:"-- Seleccione Banco --",
                LABEL_USER_TYPE:"Tipo de Persona",
                OPTION_USER_TYPE_DEFAULT:"-- Seleccione --",
                LABEL_ID_TYPE:"Tipo de Documento de Identificación",
                OPTION_ID_TYPE_DEFAULT:"-- Seleccione Tipo de Documento --",

                LABEL_PHONE_NUMBER:"Teléfono",
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

            vm.success =  _.endsWith($state.current.name, 'success') || _.endsWith($state.current.name, 'pse-response');
            vm.calendar = _mapVacancy(calendar);
            vm.capacity = calendar.capacity;
            vm.amount = calendar.session_price;

            vm.activity = activity;
            _mapMainPicture(vm.activity);

            if(currentUser) { vm.pseData.payerEmail = currentUser.user.email; }
            _setAssistants();


            console.log('activity:', vm.activity);
            console.log('calendar:', vm.calendar);
            console.log('assistants:', vm.assistants);
        }
    }
})();
