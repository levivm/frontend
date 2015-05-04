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

  Activity.$inject = ['$http', '$q', '$log', 'ActivityServerApi', 'UploadFile', 'ActivitySteps', 'CalendarsManager'];

  function Activity($http, $q, $log, ActivityServerApi, UploadFile, ActivitySteps, CalendarsManager) {

    var api = ActivityServerApi;
    var that = null;

    function Activity(activityData) {
      that = this;
      that.tags = [];
      that.certification = false;

      if (activityData) {
        //TODO eliminar cuando levi elimine del backend
        delete activityData.completed_steps;
        that.setData(activityData);
      }
    }

    Activity.prototype = {

      setData: function(activityData) {
        angular.extend(this, activityData);
        that.resetSections();
        angular.forEach(ActivitySteps, function(step){
          that.updateSection(step.name);
        });
        console.log("Activity setData ", this);
        that.checkSections();
      },

      create: function(){
        return $http.post(api.activities(),this);
      },

      generalInfo: function() {
        var deferred = $q.defer();

        if (that.presave_info){
          deferred.resolve(that.presave_info);
          return deferred.promise;
        } else {
          return $http.get(api.info()).then(function(response){
            that.presave_info = response.data;
            deferred.resolve(that.presave_info);
            return deferred.promise;
          });
        }
      },

      load: function(id){
        if (!id) { id = that.id; }

        return $http.get(api.activity(id))
            .then(function(response) {
              that.setData(response.data);
              return that;
            });
      },

      update: function() {
        return $http({
          method: 'put',
          url: api.activity(this.id),
          data: this
        }).then(function(response){
          that.setData(response.data);
          return response;
        },function(response){
          return $q.reject(response.data);
        });
      },

      addPhoto:function(image){
        return UploadFile.upload_file(image, api.gallery(this.id));
      },

      deletePhoto:function(image){
        return $http({
          method: 'put',
          url: api.gallery(this.id),
          data: {'photo_id':image.id}
        });
      },

      publish:function(){
        return $http({
          method: 'put',
          url: api.publish(this.id)
        })
        .then(function(response){
          that.published = true;
        });
      },

      /**
       * @ngdoc function
       * @name trulii.activities.services.Activity#checkSections
       * @description Checks the completion of all of the Activity's creation steps
       * @methodOf trulii.activities.services.Activity
       */
      checkSections : function (){
        that.all_steps_completed = true;
        angular.forEach(that.completed_steps, function(value){
          if(!value) that.all_steps_completed = false;
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
        that.checkSections();
        return this.all_steps_completed;
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
        that.completed_steps[section] = value;
        console.log('Activity.setSectionCompleted: ', section, ', ', that.completed_steps[section]);
      },

      /**
       * @ngdoc function
       * @name trulii.activities.services.Activity#isSectionCompleted
       * @param {string} section The section to get.
       * Available values are ['general', 'detail', 'instructors', 'location', 'gallery', 'return_policy']
       * @methodOf trulii.activities.services.Activity
       */
      isSectionCompleted : function(section){
        return that.completed_steps[section];
      },

      updateSection : updateSection,

      resetSections: resetSections,
    };

    return Activity;

    function updateSection(section, value){
      var subSections = [];
      var isCompleted = false;
      switch (section) {
        case 'general':
          subSections = ['title', 'short_description', 'category_id', 'sub_category', 'level'];
          isCompleted = subSections.every(function(subSection){
            console.log('activity[', subSection, ']: ', that.hasOwnProperty(subSection) && !!that[subSection]);
            return (that.hasOwnProperty(subSection) && !!that[subSection]);
          });
          that.setSectionCompleted('general', isCompleted);
          break;
        case 'calendars':
          var hasCalendars = that.chronograms.length > 0;
          that.setSectionCompleted('calendars', hasCalendars);
          break;
        case 'detail':
          subSections = ['content', 'audience', 'goals', 'methodology', 'requirements', 'extra_info'];
          isCompleted = subSections.some(function(subSection){
            return (that.hasOwnProperty(subSection) && !!that[subSection]);
          });
          that.setSectionCompleted('detail', isCompleted);
          break;
        case 'gallery':
          var hasPhotos = that.photos.length > 0;
          var hasVideos = that.youtube_video_url;
          that.setSectionCompleted('gallery', hasPhotos || hasVideos);
          break;
        case 'instructors':
          var hasInstructors = that.instructors.length > 0;
          that.setSectionCompleted('instructors', hasInstructors);
          break;
        case 'location':
          var hasLocation = !!that.location;
          that.setSectionCompleted('location', hasLocation);
          break;
        case 'return_policy':
          that.setSectionCompleted('return_policy', !!that.return_policy);
          break;
      }
    }

    function resetSections(){
      console.log('that:', that);
      that.completed_steps = {
        calendars: false,
        detail: false,
        gallery: false,
        general: false,
        instructors: false,
        location: false,
        return_policy: false
      };

      that.all_steps_completed = false;
    }
  }

})();