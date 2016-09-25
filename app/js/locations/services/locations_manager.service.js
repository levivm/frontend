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

    LocationManager.$inject = ['$rootScope', '$http', '$q', 'localStorageService', 'LocationServerApi', 'serverConf'];

    function LocationManager($rootScope, $http, $q, localStorageService, LocationServerApi, serverConf) {

        var api = LocationServerApi;
        var currentCity = null;
        var searchCity = null;
        var mapBounds = null;
        var availableCities = null;
        var KEY_SEARCH_CITY = "search_city";
        var KEY_CURRENT_CITY = "current_city";
        var KEY_AVAILABLE_CITIES = "availableCities";
        var CURRENT_CITY_MODIFIED_EVENT = "currentCityModified";
        var IP_INFO_DEV ='//ipinfo.io/186.116.176.170?callback=JSON_CALLBACK';
        var IP_INFO = 'https://freegeoip.net/json/?callback=JSON_CALLBACK';
        //noinspection UnnecessaryLocalVariableJS
        var LocationManager = {

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getAvailableCities
             * @description Returns an array of available cities
             * @methodOf trulii.locations.services.LocationManager
             * @return {Array} Available cities
             */
            getAvailableCities: getAvailableCities,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#setCurrentCity
             * @params {object} city City Object to persist
             * @description Sets the current city for the logged user
             * @methodOf trulii.locations.services.LocationManager
             */
            setCurrentCity: setCurrentCity,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getAvailableCities
             * @description Returns current selected city for the logged user
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} Current city
             */
            getCurrentCity: getCurrentCity,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#_getCityById
             * @params {number} city id
             * @description get the city by id
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} City
             */
            getCityById: getCityById,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#setSearchCity
             * @params {object} city City Object to persist
             * @description Sets the current city for activities search
             * @methodOf trulii.locations.services.LocationManager
             */
            setSearchCity: setSearchCity,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getSearchCity
             * @description Returns the city selected for activities search
             * @methodOf trulii.locations.services.LocationManager
             */
            getSearchCity: getSearchCity,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getAvailableCities
             * @description Returns the app's map allowed boundaries
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} Allowed boundaries
             */
            getAllowedBounds: getAllowedBounds,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getMap
             * @description set current city in the map based on a location data
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} With attributes to init google-maps-angular map
             */
            getMap: getMap,

            /**
             * @ngdoc function
             * @name trulii.locations.services.LocationManager#getMarker
             * @description extract marker position from location data
             * @methodOf trulii.locations.services.LocationManager
             * @return {object} With attributes to set google-maps-angular marker
             */
            getMarker: getMarker,

            init: init,

            CURRENT_CITY_MODIFIED_EVENT: CURRENT_CITY_MODIFIED_EVENT
        };

        function _setAvailableCities(cities) {
            availableCities = cities;
            //localStorageService.set(KEY_AVAILABLE_CITIES, availableCities);

        }

        function getAvailableCities() {
            var deferred = $q.defer();
            if (availableCities) {
                deferred.resolve(availableCities);
                return deferred.promise;
            } else {
                return _requestAvailableCities();
            }
        }

        function getCityById(city_id) {
            var deferred = $q.defer();
            getAvailableCities().then(function(cities){
                availableCities = cities;
                deferred.resolve(availableCities.filter(byId)[0]);
                function byId(city) {
                    return city.id === city_id;
                }
            });
            return deferred.promise;
        }

        function setCurrentCity(city) {
            if (city) {
                localStorageService.set(KEY_CURRENT_CITY, city);
                currentCity = city;
                $rootScope.$emit(CURRENT_CITY_MODIFIED_EVENT);
            }
        }

        function getCurrentCity() {
            if(!currentCity){
                currentCity = localStorageService.get(KEY_CURRENT_CITY);
            }

            if (currentCity) {
                return currentCity;
            }


            function byId(city) {
                return city.id === currentCity.id;
            }
        }

        function setSearchCity(city) {
            if (city) {
                localStorageService.set(KEY_SEARCH_CITY, city);
                searchCity = city;
            }
        }

        function getSearchCity() {
            if (!searchCity) {
                searchCity = localStorageService.get(KEY_SEARCH_CITY);
                //if(searchCity){
                //    searchCity = availableCities.filter(byId)[0];
                //    setSearchCity(searchCity);
                //}
            }

            if (searchCity) {
                return searchCity;
            } else {
                getAvailableCities().then(success, error);
            }

            //function byId(city) {
            //    return city.id === searchCity.id;
            //}

            function success(){

                searchCity = localStorageService.get(KEY_CURRENT_CITY);
                if(searchCity){
                    setSearchCity(searchCity);
                }
                return searchCity;
            }
            function error(){
                console.log('Error getting cities.', response.data);
            }
        }

        function getAllowedBounds() {
            mapBounds = {
                northeast: {
                    latitude: 12,
                    longitude: -67
                },
                southwest: {
                    latitude: -3,
                    longitude: -78
                }
            };
            return mapBounds;
        }

        function getMap(location, scroll) {
            if(!location){ return ;}

            var latitude;
            var longitude;

            if (location.point){
                location = angular.copy(location);
            } else {
                location = angular.copy(location.city);
            }

            latitude = location.point[0];
            longitude = location.point[1];


            var scope = this;
            var map = {
                center: {latitude: latitude, longitude: longitude},
                zoom: 14,
                options:{
                    'scrollwheel': scroll
                },
                bounds: scope.getAllowedBounds(),
                events: {
                    bounds_changed: function (_map, eventName, args) {
                        var _allowedBounds = scope.getAllowedBounds();
                        var _northeast = _allowedBounds.northeast;
                        var _southwest = _allowedBounds.southwest;
                        var northeast = new google.maps.LatLng(_northeast.latitude, _northeast.longitude);
                        var southwest = new google.maps.LatLng(_southwest.latitude, _southwest.longitude);
                        var allowedBounds = new google.maps.LatLngBounds(southwest, northeast);

                        if (allowedBounds.contains(_map.getCenter())) {
                            map.control.valid_center = _map.getCenter();
                            return;
                        }

                        try {
                            _map.panTo(map.control.valid_center);
                        } catch(exception){
                            console.error('Angular Google Maps Exception. Selected location outside of allowed bounds');
                        }
                    }
                },
                control: {
                    allowedBounds: scope.getAllowedBounds()
                }
            };
            return map;
        }

        function getMarker(location) {
            if(!location){ return ;}

            var latitude = location.point ?
                location.point[0] : location.city.point[0];
            var longitude = location.point ?
                location.point[1] : location.city.point[1];

            var marker = {
                id: 0,
                coords: {
                    latitude: latitude,
                    longitude: longitude
                },
                options: {draggable: true},
                events: {
                    dragend: function (_marker, eventName, args) {
                        var lat = _marker.getPosition().lat();
                        var lon = _marker.getPosition().lng();
                        marker.options = {
                            draggable: true,
                            labelAnchor: "100 0",
                            labelClass: "marker-labels",
                            icon: serverConf.s3URL + '/static/img/map.png'
                        };
                    }
                }
            };
            return marker;
        }


        function _setCurrentCityFromIp(){
             //CAMBIAR A IP_INFO CUANDO PRODUCCION Y IP_INFO_DEV PARA PROBAR IPS
            var deferred = $q.defer();
            var selectCity = {};
            var minor = 999999,
                calc = 0;

            $http.jsonp(IP_INFO).then(success, error);

            function success(response){
                //console.log(response);
                //var latitude = parseFloat(response.data.loc.split(',')[0]).toFixed(2);
                var latitude = response.data.latitude.toFixed(2);
                angular.forEach( availableCities, function (city, index){
                    calc =  Math.abs(latitude - parseFloat(city.point[0]).toFixed(2));
                    if(calc < minor){
                        selectCity = city;
                        minor = calc;
                    }
                    if((index + 1) === availableCities.length) deferred.resolve(selectCity);
                });

            }
            function error(response){
                console.log(response);
            }
            return deferred.promise;
        }

        function _requestAvailableCities(){
            return $http.get(api.cities()).then(success, error);

            function success(response){
                _setAvailableCities(response.data);
                return availableCities;
            }
            function error(response){
                return $q.reject(response.data);
            }
        }
        function _initGetCurrentCity(){
            var deferred = $q.defer();
            var city = getCurrentCity();
            if (getCurrentCity()){
                deferred.resolve(getCurrentCity());
            }

            return deferred.promise;

        }
        function init(){
            var deferred = $q.defer();
            getAvailableCities().then(function(cities){
                if(getCurrentCity()){
                    deferred.resolve(getCurrentCity());
                }else{
                    _setCurrentCityFromIp().then(function (selectCity){
                        setCurrentCity(selectCity);
                        deferred.resolve(selectCity);
                        getSearchCity();
                    });
                }

            });
            return deferred.promise;

        }

        return LocationManager;
    }
})();
