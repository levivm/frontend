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

            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#checkSections
             * @description Checks the completion of all of the Activity's creation steps
             * @methodOf trulii.activities.services.Activity
             */
            checkSections : function () {
                that.all_steps_completed = true;
                angular.forEach(that.completed_steps, function (value) {
                    if (!value) that.all_steps_completed = false;
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
                that.completed_steps[section] = value;
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

            updateSection : updateSection,

            resetSections : resetSections,
        };

        return Activity;

        function updateSection(section) {
            var subSections = [];
            var isCompleted = false;
            switch (section) {
                case 'general':
                    subSections = ['title', 'short_description', 'category_id', 'sub_category', 'level'];
                    isCompleted = subSections.every(function (subSection) {
                        var value = that.hasOwnProperty(subSection) && !!that[subSection];
                        //console.log('activity[', subSection, ']: ', value);
                        return (value);
                    });
                    break;
                case 'calendars':
                    that.hasOwnProperty('chronograms');
                    var hasCalendars = !!that.chronograms && (that.chronograms.length > 0);
                    isCompleted = hasCalendars;
                    break;
                case 'detail':
                    subSections = ['content', 'audience', 'goals', 'methodology', 'requirements', 'extra_info'];
                    isCompleted = subSections.some(function (subSection) {
                        return (that.hasOwnProperty(subSection) && !!that[subSection]);
                    });
                    break;
                case 'gallery':
                    var hasPhotos = !!that.photos && (that.photos.length > 0);
                    var hasVideos = !!that.youtube_video_url;
                    isCompleted = (hasPhotos || hasVideos);
                    break;
                case 'instructors':
                    var hasInstructors = !!that.instructors && (that.instructors.length > 0);
                    isCompleted = hasInstructors;
                    break;
                case 'location':
                    var hasLocation = !!that.location;
                    isCompleted = hasLocation;
                    break;
                case 'return-policy':
                    //var hasReturnPolicy = !!that[section];
                    //TODO reemplazar por comentario al cambiar key en backend
                    var hasReturnPolicy = !!that['return_policy'];
                    isCompleted = hasReturnPolicy;
                    break;
            }
            console.log('updateSection[' + section + ']: ', isCompleted);
            that.setSectionCompleted(section, isCompleted);
        }

        function resetSections() {
            that.completed_steps = {
                'calendars' : false,
                'detail' : false,
                'gallery' : false,
                'general' : false,
                'instructors' : false,
                'location' : false,
                'return-policy' : false
            };

            that.all_steps_completed = false;

            console.log('resetSections. that:', that);
        }
    }

})();