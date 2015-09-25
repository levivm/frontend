/**
 * @ngdoc object
 * @name trulii.payments
 * @description Trulii Payments Module
 */

(function () {
    'use strict';

    angular
        .module('trulii.payments', [
            'trulii.payments.services'
        ])
        .config(config);

    angular
        .module('trulii.payments.services', []);


    //noinspection JSValidateJSDoc
    /**
     * @ngdoc object
     * @name trulii.authentication.config
     * @description Authentication Module Config function
     * @requires ui.router.state.$stateProvider
     */
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider
            .state('payment-pse-response', {
                url:'/payments/pse/response',
                // controller: 'RegisterController',
                // controllerAs: 'vm',
                // templateUrl: 'partials/authentication/register.html',
                // params: {
                //     'toState': {
                //         'state': 'home',
                //         'params': {}
                //     }
                // },
                onEnter: pseResponseProccessing,
                // resolve:{
                //     pseResponseProccessing: pseResponseProccessing
                // }
            });
            // .state('register-organizer', {
            //     url:'/organizers/register/:token/',
            //     controller: 'RegisterController',
            //     controllerAs: 'vm',
            //     resolve: {
            //         validatedData :  tokenSignupValidation
            //     },
            //     templateUrl: 'partials/authentication/register_organizer.html'
            // })
            // .state('login', {
            //     url:'/login',
            //     controller: 'LoginController',
            //     controllerAs: 'vm',
            //     templateUrl: 'partials/authentication/login.html',
            //     params: {
            //         'toState' : {
            //             'state' : 'home',
            //             'params' : {}
            //         }
            //     }
            // })
            // .state('logout',{
            //     url:'/logout',
            //     controller: 'LogOutController'
            // })
            // .state('password-forgot', {
            //     url:'/password/forgot',
            //     controller: 'ForgotPasswordCtrl',
            //     controllerAs: 'vm',
            //     templateUrl: 'partials/authentication/forgot_password.html'
            // })
            // .state("password-reset", {
            //     url:'/password/reset/key/:reset_key',
            //     controller: 'ResetPasswordCtrl',
            //     controllerAs: 'vm',
            //     templateUrl: 'partials/authentication/reset_password.html'
            // })
            // .state('email-confirm', {
            //     url:'/email/confirm/:key/',
            //     controller: 'EmailConfirmCtrl',
            //     controllerAs: 'vm',
            //     templateUrl: 'modalContainer'
            // });

        /*
         * @ngdoc method
         * @name .#pseResponseProccessing
         * @description Proccess PSE payment url response. If payment is successful, user would be redirect to 
         * success enroll or payment declined state
         * @requires ui.router.state.$stateParams
         * @requires trulii.authentication.services.Authentication
         * @methodOf trulii.payments.config
         */
        pseResponseProccessing.$inject = ['$location','$state','$timeout','$q','Authentication','Payments'];
        function pseResponseProccessing($location, $state, $timeout, $q, Authentication,Payments){
            // console.log("stateParams",$stateParams);
            console.log("stateParams",$state);
            console.log("stateParams",$state.params);
            console.log("stateParams",$location.search());

            
// polPaymentMethod: "25"
// polPaymentMethodType: "4"
// polResponseCode: "1"
// polTransactionState: "4"

        // transaction_status = data.get('state_pol')
        // response_code_pol = data.get('response_code_pol')
            // #state_pol response_code_pol
            // #     4            1           Transacción aprobada
            // #     6            5           Transacción fallida
            // #     6            4           Transacción rechazada
            // #     12          9994         Transacción pendiente, por favor revisar si el \
            // #                                       débito fue realizado en el banco.

            
            // var STATE_POL_CODE_4 = '4';
            // var STATE_POL_CODE_6 = '6';
            // var STATE_POL_CODE_12 = '12';
            // var RESPONSE_CODE_POL_1 = '1';
            // var RESPONSE_CODE_POL_5 = '5';
            // var RESPONSE_CODE_POL_4 = '4';
            // var RESPONSE_CODE_POL_9994 = '9994';
            var parameters = $location.search();


            var pol_transaction_state = parameters.polTransactionState;
            var pol_response_code  = parameters.polResponseCode;

            var reference_data = parameters.referenceCode.split("-");
            var calendar_id  = parseInt(reference_data.pop());
            var activity_id = parseInt(reference_data.pop());
            var state;


            if (pol_transaction_state == Payments.KEY_PSE_STATE_POL_CODE_4 &&
               pol_response_code == Payments.KEY_PSE_RESPONSE_CODE_POL_1){
                state = Payments.KEY_PSE_APPROVED_PAYMENT;
            }
            else if (pol_transaction_state == Payments.KEY_PSE_STATE_POL_CODE_6 &&
                     pol_response_code == Payments.KEY_PSE_RESPONSE_CODE_POL_5){

                state = Payments.KEY_PSE_FAILED_PAYMENT;

            }
            else if (pol_transaction_state == Payments.KEY_PSE_STATE_POL_CODE_6 &&
                     pol_response_code == Payments.KEY_PSE_RESPONSE_CODE_POL_4){

                state = Payments.KEY_PSE_REJECTED_PAYMENT;

            }
            else if (pol_transaction_state == Payments.KEY_PSE_STATE_POL_CODE_12 &&
                     pol_response_code == Payments.KEY_PSE_RESPONSE_CODE_POL_9994){
                state = Payments.KEY_PSE_PENDING_PAYMENT;                
            }

            var state_params = {
                activity_id:activity_id,
                calendar_id:calendar_id,
                state: state
            };

            var params = _.merge(state_params,parameters);
            

            // console.log("transaction_status ",pol_transaction_state);
            // console.log("response_code_pol ",response_code_pol);
            $state.go('activities-enroll.pse-response',params);

            // $timeout(function() { ;});
            // return $q.reject();

            // return $stateParams.token? Authentication.requestSignupToken($stateParams.token) : {};
        }

    }




})();