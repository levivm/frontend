/**
* activities
* @namespace thinkster.authentication.services
*/
(function () {
  'use strict';

 
  angular
    .module('trulii.locations.services')
    .factory('LocationManager', LocationManager);

  LocationManager.$inject = ['$http','$q','$cookies','filterFilter','serverConf'];

  function LocationManager($http,$q,$cookies,filterFilter,serverConf) {  
      
      console.log(serverConf);
      this.availableCities;
      this.currentCity;
      this.mapBounds;
      var LocationManager = {
        getAvailableCities : _getAvailableCities,
        getCurrentCity    : _getCurrentCity,
        setCurrentCity   : _setCurrentCity,
        getAllowedBounds: _getAllowedBounds
      }

      function _getAvailableCities(){

         var deferred = $q.defer();

        if(this.availableCities){
          deferred.resolve(this.availableCities);
          return deferred.promise
        }
        else{
          var scope = this;
          return $http.get(serverConf.url+'/api/locations/cities/').then(function(response){    
            scope.availableCities = response.data;      
            return response.data
          });

        }

      }

      function _setCurrentCity(city){

        if (city){

          $cookies.currentCity = JSON.stringify(city);
        }
        //this.currentCity = city;

      }

      function _getCurrentCity(){

        if ($cookies.currentCity){
          return filterFilter(this.availableCities,{id:JSON.parse($cookies.currentCity).id})[0]
        }
        else{ 
          this.setCurrentCity(this.availableCities[0]);
          return this.availableCities[0]
        }
          


      }

      function _getAllowedBounds(){

        this.mapBounds = {
            northeast: {
              latitude:12,
              longitude:-67
            },
            southwest: {
              latitude:-3,
              longitude:-78

            }
          
        }
        return this.mapBounds

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
        
  };



})();