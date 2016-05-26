/**
 * @ngdoc service
 * @name trulii.organizers.services.OrganizersManager
 * @description Organizer Manager Service
 * @requires ng.$http
 * @requires ng.$q
 * @requires trulii.organizers.services.OrganizerServerApi
 * @requires trulii.organizers.services.Organizer
 */

(function () {
    'use strict';

    angular
        .module('trulii.organizers.services')
        .factory('OrganizersManager', OrganizersManager);

    OrganizersManager.$inject = ['$http', '$q', 'OrganizerServerApi', 'Organizer', 'Authentication'];

    function OrganizersManager($http, $q, OrganizerServerApi, Organizer, Authentication) {

        var api = OrganizerServerApi;
        var _pool = {};
        var reviewsDefaultPageSize = 5;
        var defaultPage = 1;

        //noinspection UnnecessaryLocalVariableJS
        var service = {

            /**
             * @ngdoc function
             * @name trulii.organizers.services.OrganizersManager#getOrganizer
             * @description Fetches a Organizer
             * @param {number} idOrganizer Organizer Id
             * @param {boolean} force_fetch Indicates whether to force fetch
             * from the server or not
             * @return {promise} Organizer Instance Promise
             * @methodOf trulii.organizers.services.OrganizersManager
             */
            getOrganizer: getOrganizer,

            /**
             * @ngdoc function
             * @name trulii.organizers.services.OrganizersManager#getCurrentOrganizer
             * @description Gets the current Organizer logged in in the app.
             * Returns ``null`` if there is no user logged in and
             * ``false`` if the user is not a organizer
             * @param {number} idStudent Student Id
             * @return {promise} Student Instance Promise
             * @methodOf trulii.organizers.services.OrganizersManager
             */
            getCurrentOrganizer: getCurrentOrganizer,
            
            /**
             * @ngdoc function
             * @name trulii.organizers.services.OrganizersManager#getReviews
             * @description Fetches a Organizer
             * @param {number} idOrganizer Organizer Id
             * @param {number} page Page of Reviews
             * @param {number} pageSize Page Size
             * @param {string} status Status Reviews
             * @return {object} Organizer Reviews
             * @methodOf trulii.organizers.services.OrganizersManager
             */
            getReviews: getReviews,
        };

        return service;

        function getCurrentOrganizer(){
            var force_fetch = true;
            return Authentication.getAuthenticatedAccount().then(successAuthAccount, errorAuthAccount);

            function successAuthAccount(authenticatedUser){
                return Authentication.isOrganizer().then(function(isOrganizer){
                    if(authenticatedUser && isOrganizer){
                        return getOrganizer(authenticatedUser.id, force_fetch);
                    } else {
                        return $q.reject(false);
                    }
                });
            }

            function errorAuthAccount(){
                console.log("getCurrentOrganizer. Couldn't resolve authenticated user");
                return $q.reject(null);
            }

        }

        function getOrganizer(idOrganizer, force_fetch) {
            var deferred = $q.defer();

            if(force_fetch){
                _load(idOrganizer, deferred);
                return deferred.promise;
            }

            var organizer = _search(idOrganizer);

            if (organizer) {
                deferred.resolve(organizer);
            } else {
                _load(idOrganizer, deferred);

            }

            return deferred.promise;
        }
        
        function  getReviews(idOrganizer, page, pageSize, status) {
            if(!page)
                page = defaultPage;
            if(!pageSize)
                pageSize = reviewsDefaultPageSize;
            if(!status)
                status = '';

          return $http.get(api.reviews(idOrganizer),
                {params: {
                  page: page,
                  page_size: pageSize,
                  status: status
                }})
                .then(success, error);

                function success(response) {
                    return response.data;
                };

                function error(response){
                  console.log("Error getting organizer reviews: ", response.data);
                }
        }

        function _retrieveInstance(organizerId, organizerData) {
            var instance = _pool[organizerId];

            if (instance) {
                instance.setData(organizerData);
            } else {
                instance = new Organizer(organizerData);
                _pool[organizerId] = instance;
            }

            return instance;
        }

        function _search(organizerId) {
            return _pool[organizerId];
        }

        function _load(organizerId, deferred) {
            $http.get(api.organizer(organizerId))
                .then(success, error);

            function success(response) {
                var organizerData = response.data;
                //console.log("from back",response.data);
                var organizer = _retrieveInstance(organizerId, organizerData);
                deferred.resolve(organizer);
            }
            function error() {
                deferred.reject();
            }
        }
    }
})();