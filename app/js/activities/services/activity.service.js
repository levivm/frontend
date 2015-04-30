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

  Activity.$inject = ['$http', '$q', '$log', 'ActivityServerApi', 'UploadFile'];

  function Activity($http, $q, $log, ActivityServerApi, UploadFile) {

      var api = ActivityServerApi;
//      this.base_url = serverConf.url+'/api/activities/';
      
      function Activity(activityData) {
        this.all_steps_completed = false;
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
            return $http({
              method: 'put',
              url: api.publish(this.id)
            })
            .then(function(response){
              scope.published = true;
            });
          },

          /**
           * @ngdoc function
           * @name trulii.activities.services.Activity#areAllStepsCompleted
           * @return {boolean} `true` if all of the activity creation steps
           * are completed, `false` otherwise
           * @methodOf trulii.activities.services.Activity
           */
          areAllStepsCompleted : function(){
              this.checkSections();
              console.log('Activity.areAllStepsCompleted: ', this.all_steps_completed);
              return this.all_steps_completed;
          },

          /**
           * @ngdoc function
           * @name trulii.activities.services.Activity#checkSections
           * @description Checks the completion of all of the Activity's creation steps
           * @methodOf trulii.activities.services.Activity
           */
          checkSections : function (){
              var scope = this;
              scope.all_steps_completed = true;
              angular.forEach(scope.completed_steps, function(value, key){
                  if(!value)
                      scope.all_steps_completed = false;
              });
          },

          /**
           * @ngdoc function
           * @name trulii.activities.services.Activity#setSectionCompleted
           * @param {string} section The section to update.
           * Available values are ['general', 'detail', 'instructors', 'location', 'gallery', 'return_policy']
           * @param {boolean} value The value to assign to the section
           * @methodOf trulii.activities.services.Activity
           */
          setSectionCompleted : function(section, value){
              console.log('Activity.setSectionCompleted: ', section, ', ', value);
              /*
              * STEPS_REQUIREMENTS = {

               'general':['title','short_description','large_description','sub_category_id','level','type'],
               'detail':['content'],
               'location':['location'],''
               'gallery':['photos'],
               'return_policy':['return_policy']
               }
               */
            this.completed_steps[section] = value;
          },

          /**
           * @ngdoc function
           * @name trulii.activities.services.Activity#isSectionCompleted
           * @param {string} section The section to get.
           * Available values are ['general', 'detail', 'instructors', 'location', 'gallery', 'return_policy']
           * @methodOf trulii.activities.services.Activity
           */
          isSectionCompleted : function(section){
              var scope = this;
              console.log('Activity.isSectionCompleted: ', section, ', ', scope.completed_steps[section]);
              return scope.completed_steps[section];
          }
      };

      return Activity;
  }

})();