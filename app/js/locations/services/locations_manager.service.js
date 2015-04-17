/**
 * @ngdoc service
 * @name trulii.locations.services.LocationManager
 * @description LocationManager
 * @requires ng.$http
 * @requires ng.$q
 * @requires ng.filter.filter
 * @requires trulii.routes.serverConf
 */

(function () {
    'use strict';

    angular
        .module('trulii.locations.services')
        .factory('LocationManager', LocationManager);

    LocationManager.$inject = ['$http', '$q', '$cookies', 'serverConf'];

    function LocationManager($http, $q, $cookies, serverConf) {

        var availableCities = null;
        var currentCity = null;
        var mapBounds = null;

        //noinspection UnnecessaryLocalVariableJS
        var LocationManager = {

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getAvailableCities
             * @description Returns an array of available cities
             * @methodOf trulii.locations.services.LocationManager
             * @return {Array} Available cities
             */
            getAvailableCities : _getAvailableCities,


            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getAvailableCities
             * @description Returns current selected city for the logged user
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} Current city
             */
            getCurrentCity    : _getCurrentCity,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getAvailableCities
             * @description Sets the current city for the logged user
             * @methodOf trulii.locations.services.LocationManager
             */
            setCurrentCity   : _setCurrentCity,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getAvailableCities
             * @description Returns the app's map allowed boundaries
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} Allowed boundaries
             */
            getAllowedBounds: _getAllowedBounds
        };

        function _getAvailableCities(){

            var deferred = $q.defer();

            if(availableCities){
                deferred.resolve(availableCities);
                return deferred.promise
            } else {
                return $http.get(serverConf.url+'/api/locations/cities/').then(function(response){
                    availableCities = response.data;
                    return response.data
                });
            }
        }

        function _setCurrentCity(city){
            if (city){
                $cookies.currentCity = JSON.stringify(city);
                currentCity = city;
            }
        }

        function _getCurrentCity(){

            var deferred = $q.defer();
            if ($cookies.currentCity){
                var persistedCurrentCity = JSON.parse($cookies.currentCity);
                deferred.resolve(availableCities.filter(byId)[0]);
            } else {
                _setCurrentCity(availableCities[0]);
                deferred.resolve(availableCities[0]);
            }

            return deferred.promise;

            function byId(city){
                return city.id === persistedCurrentCity.id;
            }
        }

        function _getAllowedBounds(){
            mapBounds = {
                northeast: {
                    latitude:12,
                    longitude:-67
                },
                southwest: {
                    latitude:-3,
                    longitude:-78
                }
            };

            return mapBounds;

        }

        // function LocationManager(locationsData) {
        //     if (locationsData) {
        //         this.setData(locationsData);
        //     }

        //     this.cache = ['1'];
        //     this.availableCities = this.getAvailableCities();
        //     console.log("sadasdasd",this.getAvailableCities());

        //     // if (!(this.availableCities)){
        //     //   console.log('availableCities',availableCities);
        //     //   this.availableCities = this.getAvailableCities();

        //     // }
        // };

        // LocationManager.prototype = {
        //     setData: function(locationsData) {
        //         angular.extend(this, locationsData);
        //     },
        //     create: function(){
        //       return $http.post('/api/activities/',this);
        //     },
        //     getAvailableCities: function() {
        //         var scope = this;

        //         return $http.get('/api/locations/cities/').then(function(response){
        //           scope.setData({'availableCities': response.data});
        //           return response.data
        //         });
        //     },
        // };

        return LocationManager;

    }
})();