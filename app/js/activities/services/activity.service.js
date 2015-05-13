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

            setData : function (activityData) {
                angular.extend(this, activityData);
                that.resetSections();
                angular.forEach(ActivitySteps, function (step) {
                    that.updateSection(step.name);
                });
                console.log("Activity setData ", this);
                
                that.checkSections();
            },


            create : function () {
                return $http.post(api.activities(), this);
            },

            load : function (id) {
                if (!id) {
                    id = that.id;
                }

                return $http.get(api.activity(id))
                    .then(function (response) {
                        that.setData(response.data);
                        return that;
                    });
            },

            update : function () {
                return $http({
                    method : 'put',
                    url : api.activity(this.id),
                    data : this
                }).then(function (response) {
                    that.setData(response.data);
                    return response;
                }, function (response) {
                    return $q.reject(response.data);
                });
            },

            addPhoto : function (image,extra_data) {
                return UploadFile.upload_file(image, api.gallery(this.id),extra_data);
            },

            deletePhoto : function (image) {
                return $http({
                    method : 'put',
                    url : api.gallery(this.id),
                    data : {'photo_id' : image.id}
                });
            },

            publish : function () {
                return $http({
                    method : 'put',
                    url : api.publish(this.id)
                })
                    .then(function (response) {
                        that.published = true;
                    });
            },
            unpublish: function(){

                return $http({
                    method : 'put',
                    url : api.unpublish(this.id)
                })
                    .then(function (response) {
                        that.published = false;
                    });

            },
            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#isFirstEdit
             * @description Check and set a flag if the activity is beign edited for first time
             * @methodOf trulii.activities.services.Activity
             */
            isFirstEdit: function(){

              if (this.photos.length>0)
                return false

              return true


            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#checkSections
             * @description Checks the completion of all of the Activity's creation steps
             * @methodOf trulii.activities.services.Activity
             */
            checkSections : function () {
                that.all_steps_completed = true;
                angular.forEach(_.keys(that.required_steps), function (value) {

                    if (!that.isSectionCompleted(value))
                        that.all_steps_completed = false;


                    // if (!value) that.all_steps_completed = false;
                });
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#areAllStepsCompleted
             * @return {boolean} `true` if all of the activity creation steps
             * are completed, `false` otherwise
             * @methodOf trulii.activities.services.Activity
             */
            areAllStepsCompleted : function () {
                that.checkSections();
                return that.all_steps_completed;
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#setSectionCompleted
             * @param {string} section The section to update.
             * Available values are ['general', 'detail', 'instructors', 'location', 'gallery', 'return-policy']
             * @param {boolean} value The value to assign to the section
             * @methodOf trulii.activities.services.Activity
             */
            setSectionCompleted : function (section, value) {
                console.log("detail",section,value);
                if(section in that.completed_steps){
                    that.completed_steps[section] = value;
                }
                console.log('Activity.setSectionCompleted: ', section, ', ', that.completed_steps[section]);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#isSectionCompleted
             * @param {string} section The section to get.
             * Available values are ['general', 'detail', 'instructors', 'location', 'gallery', 'return-policy']
             * @methodOf trulii.activities.services.Activity
             */
            isSectionCompleted : function (section) {
                return that.completed_steps[section];
            },
            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#setStepsLeft
             * @description set the steps left to publish an activity
             * @methodOf trulii.activities.services.Activity
             */
            setStepsLeft: function(){

                _.each(that.required_steps,function(value){
                    
                    that.steps_left += !that.completed_steps[value] ? 1:0;

                });
            },

            updateSection : updateSection,

            resetSections : resetSections,
        };

        return Activity;

        function updateSection(section) {
            
            var isCompleted = false;
            var subSections = that.steps[section];
            switch (section) {
                case 'general':
                    isCompleted = subSections.every(function (subSection) {
                        var value = that.hasOwnProperty(subSection) && !!that[subSection];
                        return (value);
                    });
                    break;
                case 'detail':
                    isCompleted = subSections.some(function (subSection) {
                        return (that.hasOwnProperty(subSection) && !!that[subSection]);
                    });
                    console.log("ESTA COMPLETO DETAIL",isCompleted);
                    break;
                case 'location':

                    var hasLocation = !!that[subSections];
                    isCompleted = hasLocation;
                    break;
                case 'calendars':
                    that.hasOwnProperty(subSections);
                    var hasCalendars = !!that.chronograms && (that.chronograms.length > 0);
                    isCompleted = hasCalendars;
                    break;
                case 'instructors':
                    var hasInstructors = !!that[subSections] && (that[subSections].length > 0);
                    isCompleted = hasInstructors;
                    break;
                case 'gallery':
                    var photos = _.clone(that.photos);
                    var main_photo = _.first(_.remove(photos, 'main_photo', true));
                    var hasMainPhoto = !!main_photo;
                    isCompleted = hasMainPhoto;
                    console.log("has main photo",hasMainPhoto);
                    break;
                case 'return_policy':
                    //TODO reemplazar por comentario al cambiar key en backend
                    var hasReturnPolicy = !!that[subSections];
                    isCompleted = hasReturnPolicy;
                    break;

            }
            console.log('updateSection[' + section + ']: ', isCompleted);
            that.setSectionCompleted(section, isCompleted);
            that.setStepsLeft();
        }

        function resetSections() {

            that.completed_steps = {};

            _.forEach(that.steps,function(value,key){

                that.completed_steps[key] = false;

            });


            that.all_steps_completed = false;

            console.log('resetSections. that:', that);
        }


    }

})();