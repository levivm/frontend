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
            .state('referrals', {
                url: '/referrals',
                abstract: true,
                template: '<ui-view />',
                data:{
                    pageTitle:'Invita a un amigo a Aprender | Trulii',
                    pageDescription: 'Comparte con tu amigo, familiar o conocido ese curso, taller, clase o diplomado que te gustó en Trulii y recibe grandes beneficios para ti. ¡Anímate!'
                }
            })
            .state('referrals.home', {
                url: '',
                controller: 'ReferralsHomeCtrl as referrals',
                templateUrl: 'partials/students/referrals/home.html',
                resolve: {
                    isStudent: isStudent,
                    student: getCurrentStudent,
                    referrerUrl: getReferrerUrl
                }
            })
            .state('referrals.home-anon', {
                url: '/anonymous',
                controller: 'ReferralsAnonCtrl as referrals',
                templateUrl: 'partials/students/referrals/home-anonymous.html',
                resolve: {
                    isAnon: isAnon
                }
            })
            .state('referrals.invitation', {
                url: '/invitation/:idReferrer',
                controller: 'ReferralsInvitationCtrl as referrals',
                templateUrl: 'partials/students/referrals/invitation.html',
                resolve: {
                    student: getCurrentStudent,
                    referrer: getReferrer,
                    generalInfo: getPresaveActivityInfo
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
     * @methodOf trulii.referrals.config
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
                deferred.resolve(null);
            }
        }

        function error(response){
            if(response === null || !response){
                console.warn("getCurrentStudent. There is no Authenticated User");
            } else {
                console.warn("getCurrentStudent. The Authenticated User is not a Student");
            }
            deferred.resolve(null);
        }
    }

    /**
     * @ngdoc method
     * @name .#isStudent
     * @description Checks if logged user is a Student
     * @requires student
     * @methodOf trulii.referrals.config
     */
    isStudent.$inject = ['student'];
    function isStudent(student){
        return !!student;
    }

    /**
     * @ngdoc method
     * @name .#getReferrerUrl
     * @description Assembles the referrer URL
     * @requires ui.router.state.$state
     * @requires student
     * @methodOf trulii.referrals.config
     */
    getReferrerUrl.$inject = ['$state', 'student'];
    function getReferrerUrl($state, student){
        //noinspection UnnecessaryLocalVariableJS
        var referrerUrl = $state.href('referrals.invitation', {idReferrer: student.referrer_code}, {absolute: true});
        return referrerUrl;
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
     * @methodOf trulii.referrals.config
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
     * @methodOf trulii.referrals.config
     */
    getReferrer.$inject = ['$stateParams', '$q', 'Referrals', 'defaultPicture'];
    function getReferrer($stateParams, $q, Referrals, defaultPicture) {
        var deferred = $q.defer();

        if ($stateParams.idReferrer) {
            Referrals.getReferrer($stateParams.idReferrer).then(success, error);
        } else {
            deferred.reject(null);
        }

        return deferred.promise;

        function success(referrer){
            if(!referrer.photo){
                referrer.photo = defaultPicture;
            }
            deferred.resolve(referrer);
        }

        function error(response){
            console.warn("getReferrer. There is no Referrer with that code");
            deferred.reject(response);
        }
    }

    /**
     * @ngdoc method
     * @name .#getPresaveActivityInfo
     * @description Loads general activity info like categories, subcategories, levels, etc. from
     * {@link trulii.activities.services.ActivitiesManager ActivitiesManager} Service
     * @requires trulii.activities.services.ActivitiesManager
     * @methodOf trulii.referrals.config
     */
    getPresaveActivityInfo.$inject = ['ActivitiesManager'];
    function getPresaveActivityInfo(ActivitiesManager){
        return ActivitiesManager.loadGeneralInfo();
    }

})();
