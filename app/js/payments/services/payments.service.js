/**
 * @ngdoc service
 * @name trulii.payments.services.Payments
 * @description Payments Service
 * @requires ng.$http
 * @requires ng.$q
 * @requires trulii.payments.services.PaymentServerApi
 */

(function () {
    'use strict';

    angular
        .module('trulii.payments.services')
        .factory('Payments', Payments);

    Payments.$inject = ['$q', '$window','$http','PaymentServerApi'];

    function Payments($q, $window,$http,PaymentServerApi) {

        var payU = $window.payU;
        var api = PaymentServerApi;

        //var api = PaymentServerApi;
        var PAYU_API_DATA = null;
        var MERCHANT_DATA = null;

        //For trulii backend
        var KEY_CARD_ASSOCIATION = "card_association";

        //Keys for PayU Auth
        var KEY_API_LOGIN = "apiLogin";
        var KEY_API_KEY = "apiKey";

        //Keys for PayU token
        var KEY_PAYER_ID = "payer_id";
        var KEY_NAME_CARD = "name_card";
        var KEY_NAME = "name";
        var KEY_EMAIL = "email";
        var KEY_PAYER_EMAIL = "payerEmail";
        var KEY_NUMBER = "number";
        var KEY_CONTACT_PHONE = "contactPhone";
        var KEY_EXP_MONTH = "exp_month";
        var KEY_EXP_YEAR = "exp_year";
        var KEY_METHOD = "method";
        var KEY_DOCUMENT = "document";
        var KEY_CC_PAYMENT_METHOD = "CC";
        var KEY_PSE_PAYMENT_METHOD = "PSE";
        var KEY_IDENTIFICATION_NUMBER ="identificationNumber";
        var KEY_CVV = "cvv";
        var KEY_TOKEN = "token";

        //PSE Keys
        var KEY_PSE_APPROVED_PAYMENT = "Aprobada";
        var KEY_PSE_REJECTED_PAYMENT = "Rechazada";
        var KEY_PSE_FAILED_PAYMENT   = "Fallida";
        var KEY_PSE_PENDING_PAYMENT  = "Pendiente";
        var KEY_PSE_STATE_POL_CODE_4 = '4';
        var KEY_PSE_STATE_POL_CODE_6 = '6';
        var KEY_PSE_STATE_POL_CODE_12 = '12';
        var KEY_PSE_RESPONSE_CODE_POL_1 = '1';
        var KEY_PSE_RESPONSE_CODE_POL_5 = '5';
        var KEY_PSE_RESPONSE_CODE_POL_4 = '4';
        var KEY_PSE_RESPONSE_CODE_POL_9994 = '9994';

        //PayU Values
        var CC_USER_ID = '80200';
        var PAYU_RESPONSE_URL = "https://api.trulii.com/api/payments/pse/response";
        var cardTypes = ['VISA', 'MASTERCARD', 'AMEX', 'DINERS', 'DISCOVER'];
        var requiredCardFields = {};
            requiredCardFields[KEY_NUMBER] = 'cardNumber';
            requiredCardFields[KEY_NAME_CARD] = 'cardHolder';
            requiredCardFields[KEY_EXP_YEAR]  = 'cardYear';

        var banksList = null;

        _setPayUUp();

        //noinspection UnnecessaryLocalVariableJS
        var service = {

            /**
             * @ngdoc function
             * @name .#getPayUData
             * @description Retrieves PayU data from Trulii servers
             * @return {promise} Organizer Instance Promise
             * @methodOf trulii.payments.services.Payments
             */
            getPayUData: getPayUData,

            /**
             * @ngdoc function
             * @name .#getToken
             * @description Get Payment token from PayU
             * @param {number} idStudent Student Id
             * @return {promise} Student Instance Promise
             * @methodOf trulii.payments.services.Payments
             */
            getToken: getToken,

            /**
             * @ngdoc function
             * @name .#getAvailablePSEBanks
             * @description Get banks list from PayU
             * @return {promise} Promise containing bank list
             * @methodOf trulii.payments.services.Payments
             */
            getAvailablePSEBanks: getAvailablePSEBanks,

            /**
             * @ngdoc function
             * @name .#validateCardNumber
             * @description Validate card number with PayU
             * @param {string} cardNumber Card number
             * @return {promise} Card number validation promise
             * @methodOf trulii.payments.services.Payments
             */
            validateCardNumber: validateCardNumber,

            /**
             * @ngdoc function
             * @name .#validateExpiryDate
             * @description Validate expiry date with PayU
             * @param {string} year Card expiry year
             * @param {string} month Card expiry month
             * @return {promise} Card expiry date validation promise
             * @methodOf trulii.payments.services.Payments
             */
            validateExpiryDate : validateExpiryDate,

            /**
             * @ngdoc function
             * @name .#validateCardType
             * @description Get card type from PayU
             * @param {string} cardNumber Card number
             * @return {promise} Card type promise
             * @methodOf trulii.payments.services.Payments
             */
            validateCardType : validateCardType,

            /**
             * @ngdoc function
             * @name .#getBankingInfo
             * @description Get Banking Info Choices
             * @return {promise} Banking Info promise
             * @methodOf trulii.payments.services.Payments
             */
            getBankingInfo: getBankingInfo,

            KEY_CARD_ASSOCIATION: KEY_CARD_ASSOCIATION,
            KEY_PAYER_ID : KEY_PAYER_ID,
            KEY_NAME : KEY_NAME,
            KEY_NUMBER : KEY_NUMBER,
            KEY_EMAIL : KEY_EMAIL,
            KEY_TOKEN: KEY_TOKEN,
            KEY_NAME_CARD: KEY_NAME_CARD,
            KEY_IDENTIFICATION_NUMBER: KEY_IDENTIFICATION_NUMBER,
            KEY_EXP_MONTH: KEY_EXP_MONTH,
            KEY_EXP_YEAR: KEY_EXP_YEAR,
            KEY_CVV: KEY_CVV,
            KEY_CC_PAYMENT_METHOD: KEY_CC_PAYMENT_METHOD,
            KEY_PSE_PAYMENT_METHOD: KEY_PSE_PAYMENT_METHOD,
            KEY_DOCUMENT: KEY_DOCUMENT,
            KEY_METHOD: KEY_METHOD,
            KEY_CONTACT_PHONE:KEY_CONTACT_PHONE,
            KEY_PAYER_EMAIL:KEY_PAYER_EMAIL,

            KEY_PSE_APPROVED_PAYMENT : KEY_PSE_APPROVED_PAYMENT,
            KEY_PSE_REJECTED_PAYMENT : KEY_PSE_REJECTED_PAYMENT,
            KEY_PSE_FAILED_PAYMENT : KEY_PSE_FAILED_PAYMENT,
            KEY_PSE_PENDING_PAYMENT : KEY_PSE_PENDING_PAYMENT,
            KEY_PSE_STATE_POL_CODE_4 : KEY_PSE_STATE_POL_CODE_4,
            KEY_PSE_STATE_POL_CODE_6 : KEY_PSE_STATE_POL_CODE_6,
            KEY_PSE_STATE_POL_CODE_12 : KEY_PSE_STATE_POL_CODE_12,
            KEY_PSE_RESPONSE_CODE_POL_1 : KEY_PSE_RESPONSE_CODE_POL_1,
            KEY_PSE_RESPONSE_CODE_POL_5 : KEY_PSE_RESPONSE_CODE_POL_5,
            KEY_PSE_RESPONSE_CODE_POL_4 : KEY_PSE_RESPONSE_CODE_POL_4,
            KEY_PSE_RESPONSE_CODE_POL_9994 : KEY_PSE_RESPONSE_CODE_POL_9994,

            PAYU_RESPONSE_URL:PAYU_RESPONSE_URL,
            CC_USER_ID: CC_USER_ID,
            requiredCardFields: requiredCardFields
        };

        return service;

        function getPayUData() {
            // TODO Waiting for endpoint
            var deferred = $q.defer();
            var payUData = {
                PAYU_API_KEY : '6RK49XdJYozqO05lnIJQonnbEx',
                PAYU_MERCHANT_ID : '537033',
                PAYU_API_LOGIN : 'xvoZMctc645I2Nc',
                PAYU_ACCOUNT_ID : '539061',
                PAYU_URL : 'https://api.payulatam.com/payments-api/4.0/service.cgi',
                PAYU_NOTIFY_URL : "https://api.trulii.com/api/payments/notification",
                PAYU_RESPONSE_URL : "https://api.trulii.com/api/payments/pse/response",
                PAYU_TEST : false
            };
            PAYU_API_DATA = payUData;
            MERCHANT_DATA = {};
            MERCHANT_DATA[KEY_API_LOGIN] = payUData.PAYU_API_LOGIN;
            MERCHANT_DATA[KEY_API_KEY] = payUData.PAYU_API_KEY;
            //Colocar aquí check ValidateMethod
            deferred.resolve(payUData);
            return deferred.promise;
        }


        /** PSE Payments Methods **/


        function getAvailablePSEBanks(){
            var deferred = $q.defer();

            if(banksList)
                deferred.resolve(banksList);
            else
                $http.get(api.PSEBankList()).then(success,error);


            function success(response){
                banksList = response.data;
                deferred.resolve(banksList);
            }

            function error(response){
                deferred.reject({});
            }

            return deferred.promise;


        }

        /**  --/PSE Payments Methods **/



        function getToken(paymentData) {

            var emptyFields = getEmptyPaymentData(paymentData);


            if(!emptyFields.length){
                try{
                    return getPayUData().then(getDataSuccess, getDataError);
                } catch(e){
                    return $q.reject([]);
                }
            } else {
                return $q.reject(emptyFields);
            }

            function getDataSuccess(){
                var deferred = $q.defer();
                payU.getPaymentMethods();
                payU.setCardDetails(paymentData);

                payU.createToken(getTokenResponse);

                return deferred.promise;

                function getTokenResponse(response){

                    //console.log('response de tokenization javascript:', response);
                    if(response.error){
                        deferred.reject(response);
                    } else {
                        deferred.resolve(response);
                    }
                }
            }

            function getDataError(error){
                //console.log('Error retrieving PayU data from Trulii servers', error);
                return error;
            }

            function getEmptyPaymentData(data){
                var emptyFields = _.filter(requiredCardFields, function(value,key){
                    return !data.hasOwnProperty(key)
                    || !data[key] ;

                });

                return emptyFields;
            }
        }

        function validateCardNumber(cardNumber){
            var deferred = $q.defer();
            var isValid = false;

            try {
                isValid = payU.validateCard(cardNumber);
            } catch(e){
                isValid = false;
            }
            deferred.resolve(isValid);

            return deferred.promise;
        }

        function validateExpiryDate(year, month){
            var deferred = $q.defer();
            var isValid  = false;

            if (!!month && !!year) {
                try {
                    isValid = payU.validateExpiry(year.toString(), month.toString());
                } catch(e){
                    isValid = false;
                }
            }

            if (isValid) {
                deferred.resolve(isValid);
            } else {
                deferred.reject(isValid);
            }

            return deferred.promise;
        }

        function validateCardType(cardnumber){
            var deferred = $q.defer();
            var methodType = null;

            try {
                methodType = payU.cardPaymentMethod(cardnumber);
            } catch(e){
                deferred.reject(null);
            }

            if(cardTypes.some(isValidType)){
                deferred.resolve(methodType);
            } else {
                deferred.reject(methodType);
            }

            return deferred.promise;

            function isValidType(card){
                return methodType.toUpperCase() === card;
            }
        }

        function getBankingInfo(){
            return $http.get(api.bankingInfo()).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                console.log('Error obtaining banking info:', response.data);
            }
        }

        function _setPayUUp(){
            try {
                payU.setURL('https://api.payulatam.com/payments-api/4.0/service');
                payU.setPublicKey('PK64hMu62yQ9xxWAG66942468o');
                payU.setListBoxID('payu-franchise');
                payU.setAccountID('539061');
                // TODO Get Language from i18n Service
                payU.setLanguage("es");

                getPayUData();
            } catch (e){
                console.error('Exception. payU object not defined.', e);
            }

        }
    }
})();
