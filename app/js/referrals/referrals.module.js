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
            'trulii.referrals.controllers'
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
        $stateProvider
            .state('referrals-home', {
                url: '/referrals',
                controller: 'ReferralsHomeCtrl as referrals',
                templateUrl: 'partials/students/referrals/home.html',
                resolve: {
                    getCurrentStudent: getCurrentStudent
                }
            })
            .state('referrals-home-anon', {
                url: '/referrals/anonymous',
                controller: 'ReferralsAnonCtrl as referrals',
                templateUrl: 'partials/students/referrals/home-anonymous.html'
            })
            .state('referrals-invitation', {
                url: '/referrals/invitation/:idReferrer',
                controller: 'ReferralsInvitationCtrl as referrals',
                templateUrl: 'partials/students/referrals/invitation.html',
                // resolve: {
                //     hasReferrerId: hasReferrerId
                // }
            })
        ;
    }

    /**
     * @ngdoc method
     * @name .#getCurrentStudent
     * @description Retrieves the current logged Student from
     * {@link trulii.students.services.StudentsManager StudentsManager} Service otherwise returns ``null``
     * @requires ng.$timeout
     * @requires ui.router.state.$state
     * @requires ng.$q
     * @requires trulii.students.services.StudentsManager
     * @methodOf trulii.students.config
     */
    getCurrentStudent.$inject = ['$timeout', '$state', '$q', 'StudentsManager'];
    function getCurrentStudent($timeout, $state, $q, StudentsManager){

        return StudentsManager.getCurrentStudent().then(success, error);

        function success(student){
            if(student){
                return student;
            } else {
                $timeout(function() { $state.go('referrals-home-anon'); });
            }
        }

        function error(response){
            if(response === null || !response){
                console.warn("getCurrentStudent. There is no Authenticated User");
            } else {
                console.warn("getCurrentStudent. The Authenticated User is not a Student");
            }
            $timeout(function() { $state.go('referrals-home-anon'); });
        }
    }

    /**
     * @ngdoc method
     * @name .#hasReferrerId
     * @description Checks for referrerId param, otherwise rejects the resolve
     * @requires ui.router.state.$stateParams
     * @methodOf trulii.activities.config
     */
    hasReferrerId.$inject = ['$stateParams', '$q', '$timeout'];
    function hasReferrerId($stateParams, $q, $timeout) {
        var deferred = $q.defer();

        if ($stateParams.referredId) {
            deferred.resolve(true);
        } else {
            $timeout(function() { $state.go('referrals-home'); });
        }

        return deferred.promise;
    }

})();
