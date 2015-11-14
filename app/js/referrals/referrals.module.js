/**
 * @ngdoc object
 * @name trulii.referrals
 * @description Trulii Referrals Module
 */

(function () {
    'use strict';

    angular
        .module('trulii.referrals', [
            'trulii.referrals.services',
            'trulii.referrals.controllers',
        ])
        .config(config);

    angular
        .module('trulii.referrals.controllers', []);

    angular
        .module('trulii.referrals.services', []);

    //noinspection JSValidateJSDoc
    /**
     * @ngdoc object
     * @name trulii.referrals.config
     * @description Referrals Module Config function
     * @requires ui.router.state.$stateProvider
     */
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        //$stateProvider
        //    .state('payment-pse-response', {
        //        url:'/payments/pse/response',
        //        onEnter: pseResponseProccessing,
        //    });

        $stateProvider
           .state('referrals-home', {
               url:'/referrals',
               controller: 'ReferralsHomeCtrl as referrals',
               templateUrl: 'partials/students/referrals/home.html'
           })
           .state('referrals-home-anon', {
             url: '/referrals/anonymous',
             controller: 'ReferralsAnonCtrl as referrals',
             templateUrl: 'partials/students/referrals/home-anonymous.html'
           })
           .state('referrals-invitation', {
             url: '/referrals/invitation',
             controller: 'ReferralsInvitationCtrl as referrals',
             templateUrl: 'partials/students/referrals/invitation.html'
           })
           ;
    }

})();
