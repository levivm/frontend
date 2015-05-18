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
            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#setData
             * @description Given an activity data, fill 'this' object with that data
             * @param {activityData} activityData The activity data to set 
             * @methodOf trulii.activities.services.Activity
             */
            setData : function (activityData) {
                angular.extend(this, activityData);
                that.resetSections();


                angular.forEach(ActivitySteps, function (step) {

                    that.updateSection(step.name);
                });
                console.log("Activity setData ", this);
                
                that.checkSections();
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#create
             * @description Create an activity
             * @methodOf trulii.activities.services.Activity
             */
            create : function () {
                return $http.post(api.activities(), this);
            },
            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#load
             * @description Get an activity from backend given a id
             * @param {number} id The activity id to retrieve 
             * @methodOf trulii.activities.services.Activity
             */
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
            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#update
             * @description Update the activity using 'this' object internal values
             * @methodOf trulii.activities.services.Activity
             */
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

            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#addPhoto
             * @description Publish an activity 
             * @param {file} image The image to add.
             * @param {object} extra_data The extra data to send among the image
             * @methodOf trulii.activities.services.Activity
             */
            addPhoto : function (image,extra_data) {
                return UploadFile.upload_file(image, api.gallery(this.id),extra_data);
            },

            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#deletePhoto
             * @description Publish an activity 
             * @param {file} image The image to delete.
             * @methodOf trulii.activities.services.Activity
             */
            deletePhoto : function (image) {
                return $http({
                    method : 'put',
                    url : api.gallery(this.id),
                    data : {'photo_id' : image.id}
                });
            },
            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#publish
             * @description Publish an activity 
             * @methodOf trulii.activities.services.Activity
             */
            publish : function () {
                return $http({
                    method : 'put',
                    url : api.publish(this.id)
                })
                    .then(function (response) {
                        that.published = true;
                    });
            },
            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#unpublish
             * @description Unpublish an activity 
             * @methodOf trulii.activities.services.Activity
             */
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
             * @name trulii.activities.services.Activity#hasAssistants
             * @description Check if an activity has already assitants
             * @methodOf trulii.activities.services.Activity
             */
            hasAssistants: function(){

                if (!this.chronograms)
                    return false

                return this.chronograms.some(function (chronogram) {
                        return chronogram.assistants.length > 0
                    });
            },
            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#isFirstEdit
             * @description Check and set a flag if the activity is beign edited for first time
             * @methodOf trulii.activities.services.Activity
             */
            isFirstEdit: function(){

                if (!this.photos.length && !this.published)
                    return true

                return false


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
            setStepsLeft: function(section){

                if (!that.required_steps[section])
                    return

                that.steps_left = 0;

                _.each(_.keys(that.required_steps),function(value){

                    that.steps_left += !that.completed_steps[value] ? 1:0;

                });


            },

            updateSection : updateSection,

            resetSections : resetSections,
        };

        return Activity;

        function updateSection(section) {
            
            var isCompleted = false;
            if (!that.steps)
                return
            
            var subSections = that.steps[section];
            switch (section) {
                case 'general':
                    

                    isCompleted = subSections.every(function (subSection) {
                        var value = that.hasOwnProperty(subSection) && !!that[subSection];
                        return value;
                    });
                    break;
                case 'detail':
                    isCompleted = subSections.some(function (subSection) {
                        return (that.hasOwnProperty(subSection) && !!that[subSection]);
                    });
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
                    break;
                case 'return_policy':
                    //TODO reemplazar por comentario al cambiar key en backend
                    var hasReturnPolicy = !!that[subSections];
                    isCompleted = hasReturnPolicy;
                    break;

            }

            console.log('updateSection[' + section + ']: ', isCompleted);
            that.setSectionCompleted(section, isCompleted);
            that.setStepsLeft(section);
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