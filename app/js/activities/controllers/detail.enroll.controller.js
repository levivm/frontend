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

    ActivityDetailEnrollController.$inject = ['$state', '$window', '$sce','$scope', 'ActivitiesManager',
        'StudentsManager', 'Payments', 'Authentication', 'Toast', 'Error', 'activity', 'calendar', 'currentUser',
        'deviceSessionId', 'defaultPicture', 'defaultCover', 'Elevator', 'LocationManager', 'Referrals', 'Scroll', 'Analytics', 'serverConf'];

    function ActivityDetailEnrollController($state, $window, $sce, $scope, ActivitiesManager,
                                            StudentsManager, Payments, Authentication, Toast, Error,
                                            activity, calendar, currentUser, deviceSessionId, defaultPicture, defaultCover,
                                            Elevator, LocationManager, Referrals, Scroll, Analytics, serverConf) {

        var vm = this;
        var isValidDate = false;

        angular.extend(vm, {
            success : false,
            loading_banks_list:false,
            paymentWithPse : false,
            hasCouponApplied: false,
            invalidCoupon: false,
            calendar : null,
            activity : null,
            amount : null,
            showTerms : false,
            showReimbursement : false,
            coupon: {},
            quantity : 0,
            assistants : [],
            assistantsForms:[],
            totalCost: null,
            scroll: 0,
            widgetOriginalPosition: 0,
            widgetMaxPosition: 0,
            widgetAbsolutePosition: 0,
            showWidget: true,
            processingPayment: false,

            addAssistant : addAssistant,
            removeAssistant : removeAssistant,
            enroll : enroll,
            isAnonymous : isAnonymous,
            appendPayUUniqueId: appendPayUUniqueId,
            checkCardExpiry : checkCardExpiry,
            getCardType: getCardType,
            changePSEPaymentMethod: changePSEPaymentMethod,
            changeCCPaymentMethod: changeCCPaymentMethod,
            enrollPSE: enrollPSE,
            toggleTerms : toggleTerms,
            toggleReimbursement : toggleReimbursement,
            setForm: setForm,
            applyCoupon: applyCoupon,
            removeCoupon: removeCoupon,
            getAmazonUrl: getAmazonUrl,

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
                    {'description':'Jurídica','value':'J'}
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

        // console.log("sessionID", deviceSessionId);

        _activate();

        //--------- Exposed Functions ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }



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
                var idNumber = vm.pseData.idNumber;

                var buyer_pse_data = {
                     response_url: Payments.PAYU_RESPONSE_URL,
                     bank: bank,
                     userType: userType,
                     idNumber: idNumber
                };

                var data = {
                    activity: activity.id,
                    calendar: calendar.id,
                    amount: vm.quantity * calendar.session_price,
                    quantity: vm.quantity,
                    assistants: vm.assistants,
                    buyer: buyer,
                    buyer_pse_data:buyer_pse_data,
                    payment_method: Payments.KEY_PSE_PAYMENT_METHOD,

                };
                _startProccesingPayment();
                ActivitiesManager.enroll(activity.id, data).then(_enrollSuccess, _enrollError)
                            .finally(_finishProccesingPayment);

                function _enrollSuccess(data) {
                    Analytics.studentEvents.enrollPayPse();
                    vm.success = true;
                    var bank_url = response.bank_url;
                    $window.location.href = bank_url;
                }

                function _enrollError(response){

                    var error = response.data;
                    if (!(error.assistants)){
                        Error.form.add(vm.enrollForm, error);
                    }
                    else{
                        var error_index = _.findIndex(error.assistants,function(error_dict){

                            return (!(_.isEmpty(error_dict)));
                        });
                        var base_selector = 'assistant_card_';
                        // console.log('selector',base_selector.concat(error_index));
                        Elevator.toElement(base_selector.concat(error_index));
                        Error.form.addMultipleFormsErrors(vm.assistantsForms, error.assistants);
                    }

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
                Error.form.clearField(vm.enrollForm,'cardMethod');
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

        function applyCoupon(){
            if(!vm.coupon.code){ return; }
            Referrals.getCoupon(vm.coupon.code).then(success, error);

            function success(coupon){
                console.log('coupon response', coupon);
                if(coupon){
                    vm.hasCouponApplied = true;
                    vm.invalidCoupon = false;
                    angular.extend(vm.coupon, coupon);
                    console.log('vm.coupon', vm.coupon);
                    _setTotalCost(vm.coupon.amount);
                }
            }
            function error(error){
                console.log('Error retrieving coupon', error);
                vm.invalidCoupon = true;
            }
        }

        function removeCoupon(){

            vm.coupon = {};
            vm.hasCouponApplied = false;
            _setTotalCost(0);

        }

        function enrollFree(){

            Error.form.clear(vm.enrollForm);
            Error.form.clearField(vm.enrollForm,'generalError');

            var data = {
                activity: activity.id,
                calendar: calendar.id,
                amount: vm.quantity * calendar.session_price,
                quantity: vm.quantity,
                assistants: vm.assistants,
            };

            ActivitiesManager.enroll(activity.id, data).then(_enrollSuccess, _enrollError);


            function _enrollSuccess(order) {
                console.log('enrollSuccessFree');
                Analytics.studentEvents.enrollSuccessFree();
                calendar.addAssistants(order.assistants);
                vm.success = true;
                $state.go('activities-enroll-success',{'activity_id':activity.id,'calendar_id':calendar.id,
                                    'order_id':order.id});
            }

            function _enrollError(response){
                var error = response.data;
                if (!(error.assistants)){
                    Error.form.add(vm.enrollForm, error);
                }
                else{
                    var error_index = _.findIndex(error.assistants,function(error_dict){

                        return (!(_.isEmpty(error_dict)));
                    });
                    var base_selector = 'assistant_card_';
                    // console.log('selector',base_selector.concat(error_index));
                    Elevator.toElement(base_selector.concat(error_index));
                    Error.form.addMultipleFormsErrors(vm.assistantsForms, error.assistants);
                }
                }

        }

        function enroll() {
            Error.form.clear(vm.enrollForm);
            Error.form.clearField(vm.enrollForm,'generalError');

            if(vm.paymentWithPse){
                enrollPSE();
            }
            else if (calendar.is_free){

                enrollFree();
            }
             else {
                _startProccesingPayment();
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
                // vm.cardData.invalidExpiry = true;
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
                Payments.getToken(cardData).then(getTokenSuccess, getTokenError).finally(_finishProccesingPayment);
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
                    calendar: calendar.id,
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

                if(vm.coupon.code){
                    data.coupon_code = vm.coupon.code;
                }

                vm.processingPayment = true;

                ActivitiesManager.enroll(activity.id, data).then(_enrollSuccess, _enrollError);


                function _enrollSuccess(order) {
                    Analytics.studentEvents.enrollPayTdc();
                    calendar.addAssistants(order.assistants);
                    vm.success = true;
                    $state.go('activities-enroll-success',{'activity_id':activity.id,'calendar_id':calendar.id,
                                        'order_id':order.id});
                }

                function _enrollError(response){
                    var error = response.data;
                    if (!(error.assistants)){
                        Error.form.add(vm.enrollForm, error);
                    }
                    else{
                        var error_index = _.findIndex(error.assistants,function(error_dict){

                            return (!(_.isEmpty(error_dict)));
                        });
                        var base_selector = 'assistant_card_';
                        // console.log('selector',base_selector.concat(error_index));
                        Elevator.toElement(base_selector.concat(error_index));
                        Error.form.addMultipleFormsErrors(vm.assistantsForms, error.assistants);
                    }
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
                vm.assistantsForms.splice(index, 1);
                _calculateAmount();
            } else {
                Toast.warning('Es necesario al menos un asistente a inscribir');
            }
        }

        function addAssistant() {
            if (vm.quantity  < vm.available_capacity) {

                vm.quantity += 1;
                vm.assistants.push({});
                _calculateAmount();
            } else {
                Toast.warning('El máximo de cupos disponibles es ' + vm.quantity);
            }
        }

        function setForm(form){
            vm.assistantsForms.push(form);
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
            vm.strings.COPY_SLIDEBAR_REIMBURSEMENT_BODY = vm.activity.return_policy;
            vm.showReimbursement = !vm.showReimbursement;
        }

        //--------- Internal Functions ---------//

        function _calculateAmount() {
            vm.amount = vm.quantity * calendar.session_price;
            _setTotalCost();
        }

        function _isAllBooked(){
            return calendar.available_capacity <= 0;
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
            calendar.vacancy = calendar.available_capacity;
            calendar.total_price = calendar.session_price * calendar.sessions.length;
            return calendar;
        }

        function _setTotalCost(){
            if(calendar.is_free) {
             vm.totalCost = 0;
            } else {
                vm.totalCost = vm.amount;
                if(vm.coupon.amount){
                    vm.totalCost = vm.amount - vm.coupon.amount;
                }
            }
        }

        function _setAssistants() {
            if(_isAllBooked()) {
                vm.quantity = 0;
                vm.assistants = [];
            } else {
                vm.quantity = 1;
                if(vm.calendar.hasAssistantByEmail(currentUser.user.email)){
                    vm.assistants = [{}];
                } else {
                    vm.assistants = [angular.extend({}, currentUser.user)];
                }
            }
        }

        function _setOrganizer(){
            if(!activity.organizer.photo){
                activity.organizer.photo = defaultPicture;
            }

            if (activity.organizer.locations[0]){
                var city_id = activity.organizer.locations[0].city;
                activity.organizer.city = LocationManager.getCityById(city_id).name;
            }
        }

        function _showWidget(){
            var currentState = $state.current.name;
            if (currentState === 'activities-enroll.pse-response')
                vm.showWidget = false;
        }

        function _startProccesingPayment(){
            vm.processingPayment = true;

        }

        function _finishProccesingPayment(){
            vm.processingPayment = false;

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
                ACTION_APPLY: "Aplicar",
                ACTION_GO_BACK: "Regresar",
                COPY_ASSISTANT_NUMBER: "Asistente #",
                COPY_ASSISTANTS: "Agrega la información de las personas que asistirán a la actividad.",
                COPY_STARTING_ON: "Con inicio el",
                COPY_VACANCY_SINGULAR: " Vacante",
                COPY_VACANCY: " Vacantes",
                COPY_TO: " a ",
                COPY_COVER: "Te quieres inscribir en:",
                COPY_SIGN_UP: "¿Quieres inscribirte en esta actividad?",
                COPY_ONE_MORE_STEP: "¡Estás a un paso! ",
                COPY_NO_ACCOUNT: "¿No tienes cuenta en Trulii? ¡No hay problema! ",
                COPY_UNTIL_NOW: "Hasta ahora",
                COPY_ANY_DOUBT: "¿Alguna duda? ",
                COPY_RELEASE: "Haciendo click en \"Inscribir\" estoy de acuerdo con el monto total a cancelar,"
                + " el cual incluye la comisión de la plataforma de pago,"
                + " y con los",
                COPY_RELEASE_1: "Al confirmar la inscripción, estás de acuerdo con el monto total a cancelar, la ",
                COPY_RELEASE_2: "Política de reembolso del organizador ",
                COPY_RELEASE_3: "y con los ",
                COPY_RELEASE_4: "Términos y condiciones ",
                COPY_RELEASE_5: "de Trulii",
                COPY_SLIDEBAR_TERMS_TITLE: "Términos y condiciones",
                COPY_SLIDEBAR_TERMS_HEADER: "Titulo de terminos y condiciones",
                COPY_SLIDEBAR_TERMS_BODY: "All work and no play makes Jack a dull boy",
                COPY_SLIDEBAR_REIMBURSEMENT_TITLE: "Políticas de Reembolso",
                COPY_SLIDEBAR_REIMBURSEMENT_HEADER: "Políticas de reembolso",
                COPY_SLIDEBAR_REIMBURSEMENT_BODY: "No hay politicas de reembolso",
                COPY_INVALID_COUPON: "Número de Cupón Inválido",
                LABEL_APPLY_COUPON: "Aplicar Cupón",
                LABEL_FREE_CALENDAR: "Actividad Gratis",
                COPY_FREE_CALENDAR_1: "Hoy es tu día de suerte",
                COPY_FREE_CALENDAR_2: "No tienes que ingresar ningún pago. Sólo dale click a CONFIRMAR INSCRIPCIÓN",
                LABEL_CREDIT: "Crédito",
                LABEL_COUPON: "Cupón",
                LABEL_CONTACT_US: "Contáctanos",
                LABEL_ORGANIZER: "Organizador",
                LABEL_ASSISTANTS: "Asistentes",
                LABEL_SEATS_X: "Cupos X ",
                LABEL_ACTIVITY_INFO: "Información de la Actividad",
                LABEL_ACTIVITY_SESSIONS: "Horarios",
                LABEL_START_DATE: "Fecha de Inicio",
                LABEL_NUMBER_OF_SESSIONS: "Nro. de Sesiones",
                LABEL_AVAILABLE_SEATS: "Cupos Restantes",
                LABEL_INVOICE: "Facturación",
                LABEL_PRICE: "Precio",
                LABEL_QUANTITY: "Cantidad",
                LABEL_TOTAL: "Total",
                LABEL_SCHEDULES: "Cronogramas",
                LABEL_FIRST_NAME: "Nombre",
                LABEL_LAST_NAME: "Apellido",
                LABEL_EMAIL: "Email",
                LABEL_PAYMENT_INFO: "Información de Pago",
                LABEL_TOTAL_AMOUNT: "Total a Pagar",

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
                LABEL_CARD_HOLDER: "Nombre en la tarjeta",
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
            _setOrganizer();
            _showWidget();
            vm.stateInfo = {
                toState: {
                    state : $state.current.name,
                    params : $state.params
                }
            };

            vm.success =  _.endsWith($state.current.name, 'success') || _.endsWith($state.current.name, 'pse-response');
            vm.calendar = _mapVacancy(calendar);
            vm.amount = calendar.session_price;
            vm.activity = activity;
            _mapMainPicture(vm.activity);
            _setTotalCost();

            if(currentUser) {
                vm.pseData.payerEmail = currentUser.user.email;
                _setAssistants();
            }

            if (vm.showWidget){
                angular.element(document).ready(function () {
                  if (!(document.getElementsByClassName('billing-widget')[0])){
                    return;
                  }
                  vm.scroll = window.scrollY;
                  vm.widgetOriginalPosition = document.getElementsByClassName('billing-widget')[0].getBoundingClientRect().top + window.scrollY;

                  vm.widgetMaxPosition = document.getElementsByClassName('img-carpet')[0].getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('billing-widget')[0].offsetHeight - 190;
                  vm.widgetAbsolutePosition = (document.getElementsByClassName('img-carpet')[0].getBoundingClientRect().top - document.getElementsByClassName('widget-container')[0].getBoundingClientRect().top) - document.getElementsByClassName('billing-widget')[0].offsetHeight - 190;

                  $scope.$on('scrolled',
                    function(scrolled, scroll){
                        vm.widgetMaxPosition = document.getElementsByClassName('img-carpet')[0].getBoundingClientRect().top + window.scrollY - document.getElementsByClassName('billing-widget')[0].offsetHeight - 190;
                        vm.widgetAbsolutePosition = (document.getElementsByClassName('img-carpet')[0].getBoundingClientRect().top - document.getElementsByClassName('widget-container')[0].getBoundingClientRect().top) - document.getElementsByClassName('billing-widget')[0].offsetHeight - 190;
                      vm.scroll = scroll;
                      $scope.$apply();
                    }
                  );
                });
            }



        }
    }
})();
