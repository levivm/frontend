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
        'deviceSessionId', 'defaultPicture', 'defaultCover', 'Elevator', 'LocationManager', 'Referrals', 'Scroll', 'Analytics', 'serverConf', '$filter', 'moment', '$stateParams'];

    function ActivityDetailEnrollController($state, $window, $sce, $scope, ActivitiesManager,
                                            StudentsManager, Payments, Authentication, Toast, Error,
                                            activity, calendar, currentUser, deviceSessionId, defaultPicture, defaultCover,
                                            Elevator, LocationManager, Referrals, Scroll, Analytics, serverConf, $filter, moment, $stateParams) {

        var vm = this;
        var isValidDate = false;
        var CURRENT_YEAR = moment().year();
        var MIN_YEAR = CURRENT_YEAR-1;
        var TOP_YEAR=CURRENT_YEAR+20;

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
            enrolling: false,
            coupon: {},
            package: null,
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
            attendeesOffset: 0,
            addAssistant : addAssistant,
            removeAssistant : removeAssistant,
            enroll : enroll,
            isAnonymous : isAnonymous,
            appendPayUUniqueId: appendPayUUniqueId,
            checkCardExpiry : checkCardExpiry,
            checkCvv: checkCvv,
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
            changeCalendar:changeCalendar,
            changePackage: changePackage,
            attendeesScrollDown: attendeesScrollDown,
            attendeesScrollUp: attendeesScrollUp,
            setPayment: setPayment,

            cardData : {
                "name_card": "",
                "identificationNumber": "",
                "number": "",
                exp_month: null,
                exp_year: null,
                cvv: "",
                "method": ""
                // "name_card": "APPROVED",
                // "identificationNumber": "32144457",
                // "number": "4111111111111111",
                // exp_month: 1,
                // exp_year: 2016,
                // cvv: null,
                // "method": ""
            },
            selectedPayment: 'card',
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

            months: [],
            years:[],
            yearSelected: CURRENT_YEAR,
            changeMonth: changeMonth,
            monthSelected: 'Enero',
            pseData: {}
        });

        // console.log("sessionID", deviceSessionId);

        _activate();

        //--------- Exposed Functions ---------//

        function getAmazonUrl(file){
            return  serverConf.s3URL + '/' +  file;
        }

        function changeCalendar(calendar){
          vm.calendar = _mapVacancy(calendar);
          vm.capacity = vm.calendar.capacity;
          _calculateAmount();

        }
        function changePackage(_package){
          vm.package = _package;
          _calculateAmount();
        }

        function changeMonth(){
          var numberMonth = moment().month(vm.monthSelected).format("M");
          vm.cardData.exp_month =  Number(numberMonth);
        }


        function setPayment(){
            if(vm.selectedPayment === 'card'){
                changeCCPaymentMethod();
            }
            else{
                changePSEPaymentMethod();
            }
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
            vm.enrolling = true;

            StudentsManager.getCurrentStudent().then(getStudentSuccess, getStudentError);

            function getStudentSuccess(student){
                var buyer = {};
                buyer[Payments.KEY_NAME]  = vm.pseData.name;
                buyer[Payments.KEY_PAYER_EMAIL] = vm.pseData.payerEmail;
                buyer[Payments.KEY_CONTACT_PHONE] = vm.pseData.contactPhone;

                var bank = vm.pseData.selectedBank ? vm.pseData.selectedBank.pseCode : null;
                var userType = vm.pseData.selectedUserType ? vm.pseData.selectedUserType.value : null;
                var idNumber = vm.pseData.idNumber;
                var idType = vm.pseData.idType;

                var buyer_pse_data = {
                     response_url: Payments.PAYU_RESPONSE_URL,
                     bank: bank,
                     userType: userType,
                     idNumber: idNumber
                };

                var data = {
                    activity: activity.id,
                    calendar: vm.calendar.id,
                    amount: vm.quantity * vm.calendar.session_price,
                    quantity: vm.quantity,
                    assistants: vm.assistants,
                    buyer: buyer,
                    buyer_pse_data:buyer_pse_data,
                    payment_method: Payments.KEY_PSE_PAYMENT_METHOD,

                };
                if(activity.is_open){
                    data.package = vm.package.id;
                }
                _startProccesingPayment();
                ActivitiesManager.enroll(activity.id, data).then(_enrollSuccess, _enrollError)
                            .finally(_finishProccesingPayment);

                function _enrollSuccess(response) {
                    Analytics.studentEvents.enrollPayPse();
                    vm.success = true;
                    var bank_url = response.bank_url;
                    $window.location.href = bank_url;
                    vm.enrolling = false;
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
                        console.log('selector',base_selector.concat(error_index));
                        Elevator.toElement(base_selector.concat(error_index));
                        Error.form.addMultipleFormsErrors(vm.assistantsForms, error.assistants);
                    }
                    vm.enrolling = false;

                }

            }

            function getStudentError(response){
            }
        }

        /** -----/ PSE Payments Methods **/

        function getCardType(){
            Payments.validateCardType(vm.cardData.number).then(success, error);

            function success(cardType){
                Error.form.clearField(vm.enrollForm,'cardMethod');
                vm.cardData.method = cardType;

            }

            function error(){
                vm.cardData.method = null;
            }
        }
        function checkCvv(){
            Error.form.clear(vm.enrollForm);
            
            if(vm.cardData.cvv.length !== 3){
                Error.form.add(vm.enrollForm, {'invalidCvv': ["CVV inválido"]});
            }
            else{
                Error.form.clearField(vm.enrollForm,'invalidCvv');
            }
        }

        function checkCardExpiry(){
            Error.form.clear(vm.enrollForm);
            var card = vm.cardData;

            if(card.exp_year && card.exp_month){
                Payments.validateExpiryDate(card.exp_year, card.exp_month).then(success, error);

            }

            function success(isValid){
                if(isValid){
                    isValidDate = true;
                    Error.form.clearField(vm.enrollForm,'invalidExpiry');
                } else {
                    isValidDate = false;
                    Error.form.add(vm.enrollForm, {'invalidExpiry': ["Fecha de Vencimiento inválida"]});
                }
            }

            function error(){
                isValidDate = false;
                Error.form.add(vm.enrollForm, {'invalidExpiry': ["Fecha de Vencimiento inválida"]});
            }
        }

        function applyCoupon(){
            if(!vm.coupon.code){ return; }
            Referrals.getCoupon(vm.coupon.code).then(success, error);

            function success(coupon){
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
                calendar: vm.calendar.id,
                amount: vm.quantity * vm.calendar.session_price,
                quantity: vm.quantity,
                assistants: vm.assistants,
            };

            if(activity.is_open){
                data.package = vm.package.id;
            }
            ActivitiesManager.enroll(activity.id, data).then(_enrollSuccess, _enrollError)
                              .finally(_finishProccesingPayment);


            function _enrollSuccess(order) {
                Analytics.studentEvents.enrollSuccessFree();
                vm.calendar.addAssistants(order.assistants);
                vm.success = true;
                $state.go('activities-enroll-success',{'activity_id':activity.id,'calendar_id':vm.calendar.id,
                                    'order_id':order.id});
            }

            function _enrollError(response){
                var error = response.data;
                vm.enrolling = false;
                if (!(error.assistants)){
                    Error.form.add(vm.enrollForm, error);
                }
                else{
                    var error_index = _.findIndex(error.assistants,function(error_dict){

                        return (!(_.isEmpty(error_dict)));
                    });
                    var base_selector = 'assistant_card_';
                    Elevator.toElement(base_selector.concat(error_index));
                    Error.form.addMultipleFormsErrors(vm.assistantsForms, error.assistants);
                }
                }

        }

        function enroll() {
            vm.enrolling = true;
            Error.form.clear(vm.enrollForm);
            Error.form.clearField(vm.enrollForm,'generalError');
            if(vm.paymentWithPse){
                enrollPSE();
            }
            else if (vm.calendar.is_free){
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
                vm.enrolling = false;
            }

            function successCheckCardExpiry(isValid){
                isValidDate = true;
                Error.form.clearField(vm.enrollForm,'invalidExpiry');
                Payments.validateCardType(vm.cardData.number)
                        .then(validateCardTypeSuccess,validateCardTypeError);
                vm.enrolling = false;
            }

            function errorCheckCardExpiry(response){
                console.log("Couldn't validate card expiry date");
                isValidDate = false;
                Error.form.add(vm.enrollForm, {'invalidExpiry': ["Fecha de Vencimiento inválida"]});
                _finishProccesingPayment();
                vm.enrolling = false;
            }

            function validateCardTypeSuccess(cardType){
                Error.form.clearField(vm.enrollForm,'cardMethod');
                Error.form.clearField(vm.enrollForm,'generalError');
                var cardData = _.clone(vm.cardData);
                Payments.getToken(cardData).then(getTokenSuccess, getTokenError);
                vm.enrolling = false;
            }

            function validateCardTypeError(){
                Error.form.add(vm.enrollForm, {'cardMethod': ["Tipo de tarjeta inválido"]});
                console.log("Couldn't check card type");
                _finishProccesingPayment();
                vm.enrolling = false;
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
                    calendar: vm.calendar.id,
                    token: token,
                    amount: vm.quantity * vm.calendar.session_price,
                    quantity: vm.quantity,
                    assistants: vm.assistants,
                    buyer: buyer,
                    last_four_digits: last_four_digits,
                    deviceSessionId : deviceSessionId,
                    payment_method: Payments.KEY_CC_PAYMENT_METHOD,
                    package: vm.package ? vm.package.id : null
                };

                data[Payments.KEY_CARD_ASSOCIATION] = response[Payments.KEY_METHOD];

                if(vm.coupon.code){
                    data.coupon_code = vm.coupon.code;
                }

                vm.enrolling = true;
                ActivitiesManager.enroll(activity.id, data).then(_enrollSuccess, _enrollError)
                                  .finally(_finishProccesingPayment);
                                  


                function _enrollSuccess(order) {
                    Analytics.studentEvents.enrollPayTdc();
                    vm.calendar.addAssistants(order.assistants);
                    vm.success = true;
                    $state.go('activities-enroll-success',{'activity_id':activity.id,'calendar_id':vm.calendar.id,
                                        'order_id':order.id, 'package_quantity': vm.package ? vm.package.quantity : null,
                                        'package_type': vm.package ? vm.package.type_name : null});
                }

                function _enrollError(response){
                    var error = response.data;
                    vm.enrolling = false;
                    if (!(error.assistants)){
                        Error.form.add(vm.enrollForm, error);
                    }
                    else{
                        var error_index = _.findIndex(error.assistants,function(error_dict){

                            return (!(_.isEmpty(error_dict)));
                        });
                        var base_selector = 'assistant_card_';
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
                vm.assistants.splice(vm.quantity, 1);
                vm.assistantsForms.splice(vm.quantity, 1);
                _calculateAmount();
            } else {
                Toast.warning('Es necesario al menos un asistente a inscribir');
            }
        }

        function addAssistant() {
            if ((vm.quantity  < vm.calendar.available_capacity && !vm.activity.is_open) || vm.activity.is_open) {
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

        function attendeesScrollDown(){
            vm.attendeesOffset--;
            document.getElementsByClassName('attendees-container__body__attendees-list')[0].css('transform', 'translateY('+ vm.attendeesOffset*45 +')');
        }

        function attendeesScrollUp(){
            vm.attendeesOffset++;
            document.getElementsByClassName('attendees-container__body__attendees-list')[0].css('transform', 'translateY('+ vm.attendeesOffset*45 +')');
        }

        //--------- Internal Functions ---------//

        function _calculateAmount() {
            vm.amount = vm.quantity * _getSelectedCalendarPrice();
            _setTotalCost();
        }

        function _isAllBooked(){
            if(!activity.is_open){
                return vm.calendar.available_capacity <= 0;
            }
            return false;
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
            if(!activity.is_open){
                calendar.vacancy = calendar.available_capacity;
                calendar.total_price = calendar.session_price;
                return calendar;
            }
            return calendar;
        }

        function _getPrice(calendar){
            console.log(activity.is_open);
            console.log("packete ---", vm.package);
            if (activity.is_open && vm.package)
                return vm.package.price;

            return calendar.session_price;
        }

        function _setTotalCost(){
            if(!activity.is_open){
                if(vm.calendar.is_free) {
                    vm.totalCost = 0;
                } else {
                    vm.totalCost = vm.amount;
                    if(vm.coupon.amount){
                        vm.totalCost = vm.amount - vm.coupon.amount;
                    }
                }
            }
            if(activity.is_open){
                vm.totalCost = vm.amount;
                if(vm.coupon.amount){
                    vm.totalCost = vm.amount - vm.coupon.amount;
                }
            }
        }

        function _setAssistants() {
            if(!activity.is_open){
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
            else{
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

        function _mapCalendars(activity){
            activity.upcoming_calendars = [];
            if(activity.calendars){
                activity.calendars = activity.calendars.map(mapVacancy);
                var calendars = angular.copy(activity.calendars);
                activity.upcoming_calendars = _.remove(calendars, removePastCalendars);
            }

            return activity;

            function removePastCalendars(calendar){
                var passed = moment(calendar.initial_date).isBefore(moment().valueOf(), 'day');
                return !passed;
            }

            function mapVacancy(calendar){
                calendar.vacancy = calendar.available_capacity;
                calendar.total_price = calendar.session_price;
                return calendar;
            }
        }

        function _mapYears(){
          for (var year = MIN_YEAR; year < TOP_YEAR; year++)
              vm.years.push(year);
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
                COPY_SCHEDULE_TYPE: "Horario:",
                COPY_AVAILABLE: "Disponibilidad",
                COPY_SIGN_UP: "¿Quieres inscribirte en esta actividad?",
                COPY_ONE_MORE_STEP: "¡Estás a un paso! ",
                COPY_NO_ACCOUNT: "¿No tienes cuenta en Trulii? ¡No hay problema! ",
                COPY_UNTIL_NOW: "Hasta ahora",
                COPY_ANY_DOUBT: "¿Problemas o dudas en el pago? ",
                COPY_RELEASE: "Haciendo click en \"Inscribir\" estoy de acuerdo con el monto total a cancelar,"
                + " el cual incluye la comisión de la plataforma de pago,"
                + " y con los",
                COPY_RELEASE_1: "Al confirmar la inscripción, estás de acuerdo con el monto total a cancelar,",
                COPY_RELEASE_2: "al ",
                COPY_RELEASE_3: "Política de reembolso del organizador ",
                COPY_RELEASE_4: "y con los ",
                COPY_RELEASE_5: "Términos y condiciones ",
                COPY_RELEASE_6: "de Trulii",
                COPY_SLIDEBAR_TERMS_TITLE: "Términos y condiciones",
                COPY_SLIDEBAR_TERMS_HEADER: "Titulo de terminos y condiciones",
                COPY_SLIDEBAR_TERMS_BODY: "All work and no play makes Jack a dull boy",
                COPY_SLIDEBAR_REIMBURSEMENT_TITLE: "Políticas de Reembolso",
                COPY_SLIDEBAR_REIMBURSEMENT_HEADER: "Políticas de reembolso",
                COPY_SLIDEBAR_REIMBURSEMENT_BODY: "No hay politicas de reembolso",
                COPY_INVALID_COUPON: "Número de Cupón Inválido",
                LABEL_APPLY_COUPON: "Aplicar Cupón",
                LABEL_FREE_CALENDAR: "Gratis",
                COPY_FREE_CALENDAR_1: "Hoy es tu día de suerte",
                COPY_FREE_CALENDAR_2: "Esta actividad es totalmente GRATUITA. ¡Sólo tienes que confirmar tu inscripción y listo!.",
                LABEL_CREDIT: "Crédito",
                LABEL_COUPON: "Cupón",
                LABEL_CONTACT_US: "Contáctanos",
                LABEL_ORGANIZER: "Organizador",
                LABEL_ASSISTANTS: "Asistentes",
                LABEL_SEATS_X: "Cupos X ",
                LABEL_ACTIVITY_INFO: "Información de la Actividad",
                LABEL_REPEAT_INFO:"Esta actividad se repite en otras oportunidades",
                LABEL_SCHEDULES: "Horarios",
                LABEL_START_DATE: "Fecha de Inicio",
                LABEL_NUMBER_OF_SESSIONS: "Nro. de Sesiones",
                LABEL_AVAILABLE_SEATS: "Cupos Restantes",
                LABEL_INVOICE: "Facturación",
                LABEL_PRICE: "Precio",
                LABEL_QUANTITY: "Cantidad",
                LABEL_TOTAL: "Total",
                LABEL_FIRST_NAME: "Nombre",
                LABEL_LAST_NAME: "Apellido",
                LABEL_EMAIL: "Email",
                PLACEHOLDER_EMAIL: "Email (opcional)",
                LABEL_PAYMENT_INFO: "Pago",
                LABEL_TOTAL_AMOUNT: "Total a Pagar",
                LABEL_DROPDOWN_DATE_INIT: "Fecha de inicio: ",
                LABEL_DROPDOWN_PACKAGE: "Plan: ",
                LABEL_ID_NUMBER: "Identificación",
                PLACEHOLDER_ID_NUMBER: "Ej. 18.345.995",
                LABEL_CLIENT_NAME_LAST_NAME:"Nombres y Apellidos",
                LABEL_BANK: "Elige un banco",
                OPTION_BANK_DEFAULT: "Elige un banco",
                LABEL_USER_TYPE:"Tipo de Persona",
                OPTION_USER_TYPE_DEFAULT: "Elige una opción",
                LABEL_ID_TYPE:"Tipo de Documento de Identificación",
                OPTION_ID_TYPE_DEFAULT:"Elige un documento de identidad",

                LABEL_PHONE_NUMBER: "Teléfono de uso diario",
                PLACEHOLDER_PHONE_NUMBER: "Ej. 5723488800",
                LABEL_SAVE_PAYMENT_INFO: "Deseo guardar los datos de mi tarjeta para próximas inscripciones",
                LABEL_CARD_HOLDER: "Nombre del titular",
                PLACEHOLDER_CARD_HOLDER: "Ej. Daniel Peréz Jimenez",
                LABEL_CARD_NUMBER:"Número de tarjeta de credito",
                PLACEHOLDER_CARD_NUMBER: "Número de tarjeta",
                LABEL_EXPIRY_DATE : "Fecha de Expiración",
                LABEL_MONTH: "Mes",
                PLACEHOLDER_MONTH: "MM",
                PLACEHOLDER_SELECT_MONTH: "Elige el mes",
                PLACEHOLDER_SELECT_YEAR: "Elige el año",
                LABEL_YEAR: "Año",
                PLACEHOLDER_YEAR: "YYYY",
                LABEL_CVV:"CVV",
                PLACEHOLDER_CVV:"CVV",
                LABEL_CARD: "Tarjeta",
                LABEL_PSE: "PSE",

                COPY_HEADER_REASONS_TO_USE: "¿Por qué inscribirte con Trulii?",
                COPY_DOUBTS:"¿Alguna duda? Estamos a tu orden todos los días",
                REASON_NO_COMMISSIONS: "Sin Comisiones",
                REASON_COPY_NO_COMMISSIONS_1: "Nuestro servicio para ti",
                REASON_COPY_NO_COMMISSIONS_2: "es totalmente gratuito.",
                REASON_REFUND: "Devolución Garantizada",
                REASON_COPY_REFUND_1: "Protegemos tu pago hasta",
                REASON_COPY_REFUND_2: "que se efectúe la clase.",
                REASON_SECURE: "Pago Seguro",
                REASON_COPY_SECURE_1: "Los datos del pago de tu",
                REASON_COPY_SECURE_2: "inscripción están seguros",
                REASON_COPY_SECURE_3: "con nosotros.",
                ACTION_CONTACT_US: "Contáctanos",
                LABEL_PAYMENT_ENCRYPTED: "Pago encriptado",
                TOOLTIP_CVV: "Los 3 dígitos en la parte trasera de la tarjeta",
                COPY_CLASSES_SINGULAR: " Clase",
                COPY_CLASSES: " Clases"
            });
        }

        function _updateWidgetValues(){
            vm.scroll = window.scrollY;
            vm.widgetOriginalPosition = document.getElementsByClassName('activity-enroll')[0].getBoundingClientRect().top + window.scrollY + 50;
            vm.widgetMaxPosition = document.getElementsByClassName('activity-enroll')[0].getBoundingClientRect().bottom + window.scrollY - 320;
            vm.widgetAbsolutePosition = (document.getElementsByClassName('activity-enroll')[0].getBoundingClientRect().bottom + window.scrollY) - (document.getElementsByClassName('cover-blur-small')[0].getBoundingClientRect().bottom + window.scrollY);
            vm.widgetFixedPositionLeft = document.getElementsByClassName('activity-enroll')[0].getBoundingClientRect().left + 30;
            vm.widgetFixedPositionRight = document.getElementsByClassName('activity-enroll')[0].getBoundingClientRect().right - 30 - 225;
            
        }

        function _initWidget(){
            angular.element(document).ready(function () {
                _updateWidgetValues()
                $scope.$on('scrolled',
                  function(scrolled, scroll){
                    _updateWidgetValues()
                    $scope.$apply();
                  }
                );
                $scope.$on('resized', function(){
                    _updateWidgetValues()
                    $scope.$apply();
                });
            });
        }

        function _getSelectedCalendarPrice(){
            if (activity.is_open && vm.package)
                return vm.package.price;

            return vm.calendar.session_price;
        }

        function _setSelectedPackage(){
            var pack = _.find(activity.calendars[0].packages, {'id': parseInt($stateParams.package_id)})
            if (pack)
                vm.package = pack;
        }

        function _activate(){
            _setStrings();
            _setOrganizer();
            _showWidget();
            _initWidget();
            _setSelectedPackage();
            vm.stateInfo = {
                toState: {
                    state : $state.current.name,
                    params : $state.params
                }
            };

            vm.success =  _.endsWith($state.current.name, 'success') || _.endsWith($state.current.name, 'pse-response');
            vm.calendar = _mapVacancy(calendar);
            vm.amount = _getPrice(calendar);
            activity.calendars= $filter('orderBy')(activity.calendars, 'initial_date');
            activity = _mapCalendars(activity);
            vm.activity = activity;
            _mapMainPicture(vm.activity);
            _setTotalCost();
            moment().locale('es');
            vm.months = moment.months();
            _mapYears();
            if(currentUser) {
                vm.pseData.payerEmail = currentUser.user.email;
                _setAssistants();
            }
            
            //Function for angularSeo
            $scope.htmlReady();


        }
    }
})();
