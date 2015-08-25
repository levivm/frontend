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

    Payments.$inject = ['$q', '$window'];

    function Payments($q, $window) {

        var payU = $window.payU;

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
        var KEY_EMAIL = "email";
        var KEY_NUMBER = "number";
        var KEY_EXP_MONTH = "exp_month";
        var KEY_EXP_YEAR = "exp_year";
        var KEY_METHOD = "method";
        var KEY_DOCUMENT = "document";
        var KEY_IDENTIFICATION_NUMBER ="identificationNumber";
        var KEY_CVV = "cvv";
        var KEY_TOKEN = "token";
        var cardTypes = ['VISA', 'MASTERCARD', 'AMEX', 'DINERS', 'DISCOVER'];

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

            KEY_CARD_ASSOCIATION: KEY_CARD_ASSOCIATION,
            KEY_PAYER_ID : KEY_PAYER_ID,
            KEY_NAME : KEY_NAME_CARD,
            KEY_NUMBER : KEY_NUMBER,
            KEY_EMAIL : KEY_EMAIL,
            KEY_TOKEN: KEY_TOKEN,
            KEY_NAME_CARD: KEY_NAME_CARD,
            KEY_IDENTIFICATION_NUMBER: KEY_IDENTIFICATION_NUMBER,
            KEY_EXP_MONTH: KEY_EXP_MONTH,
            KEY_EXP_YEAR: KEY_EXP_YEAR,
            KEY_CVV: KEY_CVV,
            KEY_DOCUMENT: KEY_DOCUMENT,
            KEY_METHOD: KEY_METHOD
        };

        return service;

        function getPayUData() {
            // TODO Waiting for endpoint
            var deferred = $q.defer();
            var payUData = {
                PAYU_API_KEY : '6u39nqhq8ftd0hlvnjfs66eh8c',
                PAYU_MERCHANT_ID : '500238',
                PAYU_API_LOGIN : '11959c415b33d0c',
                PAYU_ACCOUNT_ID : '500538',
                PAYU_URL : 'http://stg.api.payulatam.com/payments-api/4.0/service.cgi',
                PAYU_NOTIFY_URL : "https://api.trulii.com/api/payments/notification",
                PAYU_RESPONSE_URL : "https://api.trulii.com/api/payments/pse/response",
                PAYU_TEST : true
            };
            PAYU_API_DATA = payUData;
            MERCHANT_DATA = {};
            MERCHANT_DATA[KEY_API_LOGIN] = payUData.PAYU_API_LOGIN;
            MERCHANT_DATA[KEY_API_KEY] = payUData.PAYU_API_KEY;

            deferred.resolve(payUData);
            return deferred.promise;
        }

        function getToken(paymentData) {
            if(hasPaymentData(paymentData)){
                return getPayUData().then(getDataSuccess, getDataError);
            } else {
                return $q.reject('No payment data provided');
            }

            function getDataSuccess(){
                console.log(paymentData);
                console.log(payU);
                var deferred = $q.defer();
                payU.getPaymentMethods();
                payU.setCardDetails(paymentData);
                payU.createToken(getTokenResponse);
                return deferred.promise;

                function getTokenResponse(response){
                    console.log('response de tokenization javascript:', response);
                    deferred.resolve(response);
                }
            }

            function getDataError(error){
                console.log('Error retrieving PayU data from Trulii servers', error);
                return error;
            }

            function hasPaymentData(data){
                return data.hasOwnProperty(KEY_PAYER_ID) && data.hasOwnProperty(KEY_NAME_CARD)
                    && data.hasOwnProperty(KEY_NUMBER) && data.hasOwnProperty(KEY_METHOD)
                    && data.hasOwnProperty(KEY_EXP_MONTH) && data.hasOwnProperty(KEY_EXP_YEAR)
                    && data.hasOwnProperty(KEY_IDENTIFICATION_NUMBER);
            }
        }

        function validateCardNumber(cardNumber){
            var deferred = $q.defer();
            var isValid = payU.validateCard(cardNumber);
            deferred.resolve(isValid);

            return deferred.promise;
        }

        function validateExpiryDate(year, month){
            var deferred = $q.defer();
            var isValid = payU.validateExpiry(year, month);
            deferred.resolve(isValid);

            return deferred.promise;
        }

        function validateCardType(cardnumber){
            var deferred = $q.defer();
            var methodType = payU.cardPaymentMethod(cardnumber);
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

        function _setPayUUp(){
            payU.setURL('https://api.payulatam.com/payments-api/4.0/service');
            payU.setPublicKey('PK64hMu62yQ9xxWAG66942468o');
            payU.setListBoxID('payu-franchise');
            payU.setAccountID('539061');
            // TODO Get Language from i18n Service
            payU.setLanguage("es");

            getPayUData();
        }
    }
})();