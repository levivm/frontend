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

    OrganizersManager.$inject = ['$http', '$q', 'OrganizerServerApi', 'Organizer'];

    function OrganizersManager($http, $q, OrganizerServerApi, Organizer) {

        var api = OrganizerServerApi;
        var _pool = {};

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
            getOrganizer: getOrganizer
        };

        return service;

        function getOrganizer(idOrganizer, force_fetch) {
            var deferred = $q.defer();

            if(force_fetch){
                console.log("FETCHING NEW");
                _load(idOrganizer, deferred);
                console.log("FETCHING NEW",deferred.promise);
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
                .then(sucess, error);

            function success(response) {
                var organizerData = response.data;
                console.log("from back",response.data);
                var organizer = _retrieveInstance(organizerId, organizerData);
                deferred.resolve(organizer);
            }
            function error() {
                deferred.reject();
            }
        }
    }
})();