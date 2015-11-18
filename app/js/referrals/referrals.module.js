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
                    student: getCurrentStudent
                }
            })
            .state('referrals-home-anon', {
                url: '/referrals/anonymous',
                controller: 'ReferralsAnonCtrl as referrals',
                templateUrl: 'partials/students/referrals/home-anonymous.html',
                resolve: {
                    isAnon: isAnon
                }
            })
            .state('referrals-invitation', {
                url: '/referrals/invitation/:idReferrer',
                controller: 'ReferralsInvitationCtrl as referrals',
                templateUrl: 'partials/students/referrals/invitation.html',
                resolve: {
                    referrer: getReferrer
                }
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
    getCurrentStudent.$inject = ['$q', 'StudentsManager'];
    function getCurrentStudent($q, StudentsManager){
        var deferred = $q.defer();

        StudentsManager.getCurrentStudent().then(success, error);

        return deferred.promise;

        function success(student){
            if(student){
                deferred.resolve(student);
            } else {
                deferred.reject(null);
            }
        }

        function error(response){
            if(response === null || !response){
                console.warn("getCurrentStudent. There is no Authenticated User");
            } else {
                console.warn("getCurrentStudent. The Authenticated User is not a Student");
            }
            deferred.reject(response);
        }
    }

    /**
     * @ngdoc method
     * @name .#isAnon
     * @description Checks if there's a Student logged in from
     * {@link trulii.students.services.StudentsManager StudentsManager} Service otherwise returns ``null``
     * @requires ng.$timeout
     * @requires ui.router.state.$state
     * @requires ng.$q
     * @requires trulii.students.services.StudentsManager
     * @methodOf trulii.students.config
     */
    isAnon.$inject = ['$q', 'StudentsManager'];
    function isAnon($q, StudentsManager){
        var deferred = $q.defer();

        StudentsManager.getCurrentStudent().then(success, error);

        return deferred.promise;

        function success(student){
            if(student){
                deferred.reject(null);
            } else {
                deferred.resolve(true);
            }
        }

        function error(response){
            if(response === null || !response){
                console.warn("getCurrentStudent. There is no Authenticated User");
            } else {
                console.warn("getCurrentStudent. The Authenticated User is not a Student");
            }
            deferred.resolve(true);
        }
    }

    /**
     * @ngdoc method
     * @name .#getReferrer
     * @description Checks for referrerId param and retrieves referrer, otherwise rejects the resolve
     * @requires ui.router.state.$stateParams
     * @methodOf trulii.activities.config
     */
    getReferrer.$inject = ['$stateParams', '$q', 'Referrals'];
    function getReferrer($stateParams, $q, Referrals) {
        var deferred = $q.defer();

        if ($stateParams.idReferrer) {
            Referrals.getReferrer($stateParams.idReferrer).then(success, error);
        } else {
            deferred.reject(null);
        }

        return deferred.promise;

        function success(referrer){
            deferred.resolve(referrer);
        }

        function error(response){
            console.warn("getReferrer. There is no Referrer with that code");
            deferred.reject(response);
        }
    }

})();
