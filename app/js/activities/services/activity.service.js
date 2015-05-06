/**
 * @ngdoc service
 * @name trulii.activities.services.Activity
 * @description Activity Service
 * @requires ng.$http
 * @requires ng.$q
 * @requires trulii.routes.serverConf
 * @requires trulii.utils.services.UploadFile
 */

(function () {
  'use strict';
 
  angular
    .module('trulii.activities.services')
    .factory('Activity', Activity);

  Activity.$inject = ['$http', '$q', '$log', 'ActivityServerApi', 'UploadFile','LocationManager'];

  function Activity($http, $q, $log, ActivityServerApi, UploadFile,LocationManager) {

      var api = ActivityServerApi;
//      this.base_url = serverConf.url+'/api/activities/';
      
      function Activity(activityData) {
        this.tags = [];
        this.certification = false;
        if (activityData) {
            this.setData(activityData);
            console.log("Activity data ",activityData);
        }
      }

      Activity.prototype = {
          setData: function(activityData) {
              angular.extend(this, activityData);
              this._setCity();
          },
          _setCity:function(){

            var city_id;
            var city;
            var organizer_city;


            this.location = this.location ? this.location:{};
            
            console.log("this location ",this.location);

            city_id  = this.location ? this.location.city : null;


            if (!(city_id))
              city = LocationManager.getCurrentCity();
            else
              city = LocationManager.getCityById(city_id)

            console.log("location city",city);

            this.location.city = city;

          },
          create: function(){
            // this.base_url
            return $http.post(api.activities(),this);
          },
          generalInfo: function() {
              console.log("CAI AQUI");
              var scope = this;
              var deferred = $q.defer();

              if (scope.presave_info){
                deferred.resolve(scope.presave_info);                
                return deferred.promise;
              } else{
                // this.base_url + "info/"
                return $http.get(api.info()).then(function(response){
                  scope.presave_info = response.data;
                  deferred.resolve(scope.presave_info);
                  return deferred.promise;
                });
              }
          },
          load: function(id){
            var scope = this;

            if (!id) { id = scope.id; }

            //this.base_url + id;
            return $http.get(api.activity(id))
              .then(function(response) {
                scope.setData(response.data);
                return scope;
              });
          },
          update: function() {
            //this.base_url + this.id;
            var scope = this;
            return $http({
              method: 'put',
              url: api.activity(this.id),
              data: this
            }).then(function(response){
              scope.setData(response.data);
              return response;
            },function(response){
              return $q.reject(response.data);
            });
          },
          addPhoto:function(image){
            //this.base_url + this.id + '/gallery';
            return UploadFile.upload_file(image, api.gallery(this.id));
          },
          deletePhoto:function(image){
            //this.base_url + this.id + '/gallery';
            return $http({
              method: 'put',
              url: api.gallery(this.id),
              data: {'photo_id':image.id}
            });
          },
          publish:function(){
            var scope = this;
            //this.base_url + this.id + '/publish';
            return $http({
              method: 'put',
              url: api.publish(this.id)
            })
            .then(function(response){
              scope.published = true;

            });
          }
      };

      return Activity;
  }

})();