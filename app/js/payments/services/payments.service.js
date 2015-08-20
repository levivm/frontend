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

    Payments.$inject = ['$http', '$q', 'PaymentServerApi'];

    function Payments($http, $q, PaymentServerApi) {

        var api = PaymentServerApi;
        var PAYU_API_DATA = null;
        var MERCHANT_DATA = null;
        var KEY_CARD_ASSOCIATION = "card_association";
        var KEY_LANGUAGE = "language";
        var KEY_COMMAND = "command";
        var KEY_MERCHANT = "merchant";
        var KEY_API_LOGIN = "apiLogin";
        var KEY_API_KEY = "apiKey";
        var KEY_CREDIT_CARD_TOKEN = "creditCardToken";
        var KEY_CREDIT_CARD_TOKEN_ID = "creditCardTokenId";
        var KEY_PAYER_ID = "payerId";
        var KEY_NAME = "name";
        var KEY_EMAIL = "email";
        var KEY_ID_NUMBER = "identificationNumber";
        var KEY_PAYMENT_METHOD = "paymentMethod";
        var KEY_NUMBER = "number";
        var KEY_MASKED_NUMBER = "maskedNumber";
        var KEY_EXPIRATION_DATE = "expirationDate";
        var COMMAND_CREATE_TOKEN = "CREATE_TOKEN";

        _setPayUUp();

        //noinspection UnnecessaryLocalVariableJS
        var service = {

            /**
             * @ngdoc function
             * @name trulii.payments.services.Payments#getPayUData
             * @description Retrieves PayU data from Trulii servers
             * @return {promise} Organizer Instance Promise
             * @methodOf trulii.payments.services.Payments
             */
            getPayUData: getPayUData,

            /**
             * @ngdoc function
             * @name trulii.payments.services.Payments#getToken
             * @description Get Payment token from PayU
             * @param {number} idStudent Student Id
             * @return {promise} Student Instance Promise
             * @methodOf trulii.payments.services.Payments
             */
            getToken: getToken,

            KEY_CARD_ASSOCIATION: KEY_CARD_ASSOCIATION,
            KEY_PAYER_ID : KEY_PAYER_ID,
            KEY_NAME : KEY_NAME,
            KEY_ID_NUMBER : KEY_ID_NUMBER,
            KEY_PAYMENT_METHOD : KEY_PAYMENT_METHOD,
            KEY_NUMBER : KEY_NUMBER,
            KEY_EMAIL : KEY_EMAIL,
            KEY_EXPIRATION_DATE : KEY_EXPIRATION_DATE,
            KEY_CREDIT_CARD_TOKEN: KEY_CREDIT_CARD_TOKEN,
            KEY_CREDIT_CARD_TOKEN_ID : KEY_CREDIT_CARD_TOKEN_ID,
            KEY_MASKED_NUMBER: KEY_MASKED_NUMBER
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
                var requestData = {};
                // TODO Get Language from i18n Service
                requestData[KEY_LANGUAGE] = "es";
                requestData[KEY_COMMAND] = COMMAND_CREATE_TOKEN;
                requestData[KEY_MERCHANT] = MERCHANT_DATA;
                requestData[KEY_CREDIT_CARD_TOKEN] = paymentData;

                return $http.post(PAYU_API_DATA.PAYU_URL, requestData).then(getTokenSuccess, getTokenError);
            }

            function getDataError(error){
                console.log('Error retrieving PayU data from Trulii servers', error);
                return error;
            }

            function getTokenSuccess(response){
                return response.data;
            }

            function getTokenError(response){
                console.log('Error getting token from PayU.', response);
                return response.data;
            }

            function hasPaymentData(data){
                return data.hasOwnProperty(KEY_PAYER_ID) && data.hasOwnProperty(KEY_NAME)
                    && data.hasOwnProperty(KEY_ID_NUMBER) && data.hasOwnProperty(KEY_PAYMENT_METHOD)
                    && data.hasOwnProperty(KEY_NUMBER) && data.hasOwnProperty(KEY_EXPIRATION_DATE);
            }
        }

        function _setPayUUp(){
            payU.setURL('https://api.payulatam.com/payments-api/4.0/service');
            payU.setPublicKey('PK64hMu62yQ9xxWAG66942468o');
            payU.setListBoxID('payu-franchise');
            payU.setAccountID('539061');
            payU.setLanguage("es");
            payU.getPaymentMethods();
            //payU.setCardDetails(
            //    {
            //        number:'4111111111111111',
            //        name_card:'NOMBRE_TARJETA',
            //        payer_id:'10',
            //        exp_month:1,
            //        exp_year:2017,
            //        method:'VISA',
            //        "name": "APPROVED",
            //        "identificationNumber": "32144457"
            //    }
            //);
            payU.setCardDetails(
                {
                    number:'5434481002839600',
                    name_card:'JOSE RODRIGUEZ',
                    payer_id:'10',
                    exp_month:5,
                    exp_year:2019,
                    method:'MASTERCARD',
                    "name": "JOSE RODRIGUEZ"
                }
            );
            payU.createToken(responseHandler);

            function responseHandler(response){
                console.log('response de tokenization javascript:', response);
            }
        }
    }
})();