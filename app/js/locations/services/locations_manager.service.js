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

    LocationManager.$inject = ['$http', '$q', '$cookies', 'serverConf','localStorageService'];

    function LocationManager($http, $q, $cookies, serverConf,localStorageService) {

        var currentCity = null;
        var searchCity = null;
        var mapBounds = null;
        var KEY_SEARCH_CITY = "search_city";
        var KEY_AVAILABLE_CITIES = "availableCities";

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
             * @name trulii.locations.services.LocationManager#setCurrentCity
             * @params {object} city City Object to persist
             * @description Sets the current city for the logged user
             * @methodOf trulii.locations.services.LocationManager
             */
            setCurrentCity   : _setCurrentCity,

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
             * @name trulii.locations.services.LocationManager#_getCityById
             * @params {number} city id
             * @description get the city by id
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} City
             */
            getCityById   : _getCityById,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#setSearchCity
             * @params {object} city City Object to persist
             * @description Sets the current city for activities search
             * @methodOf trulii.locations.services.LocationManager
             */
            setSearchCity   : _setSearchCity,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getSearchCity
             * @description Returns the city selected for activities search
             * @methodOf trulii.locations.services.LocationManager
             */
            getSearchCity   : _getSearchCity,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getAvailableCities
             * @description Returns the app's map allowed boundaries
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} Allowed boundaries
             */
            getAllowedBounds: _getAllowedBounds,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getMap
             * @description set current city in the map based on a location data
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} With attributes to init google-maps-angular map
             */
            getMap: _getMap,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getMarker
             * @description extract marker position from location data
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} With attributes to set google-maps-angular marker
             */
            getMarker: _getMarker
        };

        function _getAvailableCities(){

            var deferred = $q.defer();
            var availableCities = localStorageService.get('availableCities');
            if(availableCities){
                deferred.resolve(availableCities);
                return deferred.promise;
            } else {
                return $http.get(serverConf.url+'/api/locations/cities/').then(function(response){
                    localStorageService.set('availableCities',response.data);
                    return response.data;
                });
            }
        }

        function _getCityById(city_id){

            var availableCities = localStorageService.get('availableCities');
            
            function byId(city){
                return city.id === city_id;
            }

            return availableCities.filter(byId)[0];
        }


        function _setCurrentCity(city){
            if (city){
                localStorageService.set('current_city',city);
                currentCity = city;
            }
        }

        function _getCurrentCity(){
            var availableCities = localStorageService.get('availableCities');
            var current_city = localStorageService.get('current_city');

            if (current_city){
                return availableCities.filter(byId)[0];
            } else {
                localStorageService.set('current_city',availableCities[0]);
                return availableCities[0];
            }

            function byId(city){
                return city.id === current_city.id;
            }
        }

        function _setSearchCity(city){
            if (city){
                localStorageService.set(KEY_SEARCH_CITY,city);
                searchCity = city;
            }
        }

        function _getSearchCity(){
            var availableCities = localStorageService.get(KEY_AVAILABLE_CITIES);

            if(!searchCity){
                searchCity = localStorageService.get(KEY_SEARCH_CITY);
                if (searchCity){
                    return searchCity;
                } else {
                    localStorageService.set(KEY_SEARCH_CITY, availableCities[0]);
                    searchCity = availableCities[0];
                    return availableCities[0];
                }
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

        function _getMap(location){

            var latitude;
            var longitude;

            if (location.point)
              location = angular.copy(location);
            else
              location = angular.copy(location.city);

            latitude  = location.point[0];
            longitude = location.point[1];

            console.log("latitude","longitude",latitude,longitude);

            var scope = this;
            var map = {
              center: {latitude: latitude, longitude: longitude }, 
              zoom: 14, 
              bounds: scope.getAllowedBounds() ,

              events: {

                bounds_changed : function(_map, eventName, args) {

                  var _allowedBounds = scope.getAllowedBounds();

                  var _northeast = _allowedBounds.northeast;
                  var _southwest = _allowedBounds.southwest;
                  var  northeast = new google.maps.LatLng(_northeast.latitude,_northeast.longitude);
                  var  southwest = new google.maps.LatLng(_southwest.latitude,_southwest.longitude);

                  var allowedBounds = new google.maps.LatLngBounds(southwest,northeast);

                  if (allowedBounds.contains(_map.getCenter())) {
                    map.control.valid_center = _map.getCenter();
                    return;
                  }

                  _map.panTo(map.control.valid_center);

                }

              },
              control : {
                allowedBounds : scope.getAllowedBounds()

              }

            };

            return map;

        }

        function _getMarker(location){

          var latitude  = location.point ? 
                         location.point[0] : location.city.point[0];
          var longitude = location.point ? 
                         location.point[1] : location.city.point[1];

          var marker = {
            id: 0,
            coords: {
              latitude: latitude,
              longitude: longitude
            },
            options: { draggable: true },
            events: {
              dragend: function (_marker, eventName, args) {
                var lat = _marker.getPosition().lat();
                var lon = _marker.getPosition().lng();



                marker.options = {
                  draggable: true,
                  labelAnchor: "100 0",
                  labelClass: "marker-labels"
                };
              }
            }
          };

          return marker
        }


        return LocationManager;

    }
})();