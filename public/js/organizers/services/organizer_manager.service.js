(function () {
    'use strict';

    angular
        .module('trulii.organizers.services')
        .factory('organizersManager', organizersManager);

    organizersManager.$inject = ['$http', '$q', 'serverConf', 'Organizer'];

    function organizersManager($http, $q, serverConf, Organizer) {
        return {
            _base_url: serverConf.url+'/api/organizers/',
            _pool: {},
            _retrieveInstance: function (organizerId, organizerData) {
                var instance = this._pool[organizerId];

                if (instance) {
                    instance.setData(organizerData);
                } else {
                    instance = new Organizer(organizerData);
                    this._pool[organizerId] = instance;
                }

                return instance;
            },
            _search: function (organizerId) {
                return this._pool[organizerId];
            },
            _load: function (organizerId, deferred) {
                var scope = this;

                $http.get(this._base_url + organizerId)
                    .then(function (response) {
                        var organizerData = response.data;
                        var organizer = scope._retrieveInstance(organizerId, organizerData);
                        deferred.resolve(organizer);
                    }, function () {
                        deferred.reject();
                    });
            },
            getOrganizer: function (organizerId) {
                var deferred = $q.defer();
                var organizer = this._search(organizerId);

                if (organizer) {
                    deferred.resolve(organizer);
                } else {
                    this._load(organizerId, deferred);
                }

                return deferred.promise;
            }
        }
    }
})();