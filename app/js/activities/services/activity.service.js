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

    Activity.$inject = ['$http', '$q', 'ActivityServerApi', 'UploadFile', 'ActivitySteps'];

    function Activity($http, $q, ActivityServerApi, UploadFile, ActivitySteps) {

        var api = ActivityServerApi;

        function Activity(activityData) {
            var that = this;
            that.tags = [];
            that.certification = false;

            if (activityData) { that.setData(activityData); }
        }

        Activity.prototype = {

            /**
             * @ngdoc function
             * @name .#setData
             * @description Given an activity data, fill 'this' object with that data
             * @param {object} activityData The activity data to set
             * @methodOf trulii.activities.services.Activity
             */
            setData : function (activityData) {
                angular.extend(this, activityData);
                this.calendars = this.calendars;
                var that = this;
                that.resetSections();


                angular.forEach(ActivitySteps, function (step) {

                    that.updateSection(step.name);
                });

                //console.log("Activity setData ", this);

                that.checkSections();
            },

            /**
             * @ngdoc function
             * @name .#create
             * @description Create an activity
             * @methodOf trulii.activities.services.Activity
             */
            create : create,

            /**
             * @ngdoc function
             * @name .#load
             * @description Get an activity from backend given a id
             * @param {number} id The activity id to retrieve
             * @methodOf trulii.activities.services.Activity
             */
            load : load,

            /**
             * @ngdoc function
             * @name .#update
             * @description Update the activity using 'this' object internal values
             * @methodOf trulii.activities.services.Activity
             */
            update : update,

            /**
             * @ngdoc function
             * @name .#update_location
             * @description Update the activity using 'this' object internal values
             * @methodOf trulii.activities.services.Activity
             */
            update_location: update_location,

            /**
             * @ngdoc function
             * @name .#setStockCover
             * @description Set a stock cover to a activity
             * @param {object} cover The stock cover to set.
             * @methodOf trulii.activities.services.Activity
             */
            setStockCover : setStockCover,

            /**
             * @ngdoc function
             * @name .#addPicture
             * @description Add picture to an activity gallery
             * @param {object} picture The picture to add.
             * @param {object} extra_data The extra data to send along with the picture
             * @methodOf trulii.activities.services.Activity
             */
            addPicture : addPicture,

            /**
             * @ngdoc function
             * @name .#addPictureFromStock
             * @description Add picture to the activity gallery from our picture stock
             * given a subcategory
             * @methodOf trulii.activities.services.Activity
             */
            addPictureFromStock : addPictureFromStock,

            /**
             * @ngdoc function
             * @name .#deletePicture
             * @description Publish an activity
             * @param {object} picture The picture to delete.
             * @methodOf trulii.activities.services.Activity
             */
            deletePicture : deletePicture,

            /**
             * @ngdoc function
             * @name .#publish
             * @description Publish an activity
             * @methodOf trulii.activities.services.Activity
             */
            publish : publish,

            /**
             * @ngdoc function
             * @name .#unpublish
             * @description Unpublish an activity
             * @methodOf trulii.activities.services.Activity
             */
            unpublish: unpublish,

            /**
             * @ngdoc function
             * @name .#hasAssistants
             * @description Check if an activity has already assitants
             * @methodOf trulii.activities.services.Activity
             */
            hasAssistants: hasAssistants,

            /**
             * @ngdoc function
             * @name .#isFirstEdit
             * @description Check and set a flag if the activity is beign edited for first time
             * @methodOf trulii.activities.services.Activity
             */
            isFirstEdit: isFirstEdit,

            /**
             * @ngdoc function
             * @name .#checkSections
             * @description Checks the completion of all of the Activity's creation steps
             * @methodOf trulii.activities.services.Activity
             */
            checkSections : checkSections,

            /**
             * @ngdoc function
             * @name .#areAllStepsCompleted
             * @return {boolean} `true` if all of the activity creation steps
             * are completed, `false` otherwise
             * @methodOf trulii.activities.services.Activity
             */
            areAllStepsCompleted : areAllStepsCompleted,

            /**
             * @ngdoc function
             * @name .#setSectionCompleted
             * @param {string} section The section to update.
             * Available values are ['general', 'detail', 'instructors', 'location', 'gallery', 'return-policy']
             * @param {boolean} value The value to assign to the section
             * @methodOf trulii.activities.services.Activity
             */
            setSectionCompleted : setSectionCompleted,

            /**
             * @ngdoc function
             * @name .#isSectionCompleted
             * @param {string} section The section to get.
             * Available values are ['general', 'detail', 'instructors', 'location', 'gallery', 'return-policy']
             * @methodOf trulii.activities.services.Activity
             */
            isSectionCompleted : isSectionCompleted,

            /**
             * @ngdoc function
             * @name .#setStepsLeft
             * @description set the steps left to publish an activity
             * @methodOf trulii.activities.services.Activity
             */
            setStepsLeft: setStepsLeft,
            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#setAllSections
             * @description Reset and update activity section status from ActivitySteps steps
             * @methodOf trulii.activities.services.Activity
             */
            setAllSections: setAllSections,

            /**
             * @ngdoc function
             * @name trulii.activities.services.Activity#updateSections
             * @description Update activity section status from ActivitySteps steps
             * @methodOf trulii.activities.services.Activity
             */
            updateAllSections: updateAllSections,

            /**
             * @ngdoc function
             * @name .#updateSection
             * @description Update activity section status from ActivitySteps steps
             * @param {string} section The section to update.
             * @methodOf trulii.activities.services.Activity
             */
            updateSection: updateSection,

            /**
             * @ngdoc function
             * @name .#resetSections
             * @description Reset all activity sections
             * @methodOf trulii.activities.services.Activity
             */
            resetSections: resetSections,

            /**
             * @ngdoc function
             * @name .#getInstructors
             * @description Retrieves all Activity related Instructors
             * @methodOf trulii.activities.services.Activity
             */
            getInstructors: getInstructors,

            /**
             * @ngdoc function
             * @name .#createInstructor
             * @description Creates a new Instructor for the organizer and appends it to the Activity
             * @methodOf trulii.activities.services.Activity
             */
            createInstructor: createInstructor,

            /**
             * @ngdoc function
             * @name .#updateInstructor
             * @description Updates an Instructor from the Activity
             * @methodOf trulii.activities.services.Activity
             */
            updateInstructor: updateInstructor,

            /**
             * @ngdoc function
             * @name .#deleteInstructor
             * @description Deletes an Instructor from the Activity but not from the Organizer
             * @methodOf trulii.activities.services.Activity
             */
            deleteInstructor: deleteInstructor
        };

        return Activity;

        function setData(activityData) {
            angular.extend(this, activityData);
            var that = this;
            this.calendars = this.calendars;
            delete this.calendars;
            that.resetSections();
            angular.forEach(ActivitySteps, function (step) {
                that.updateSection(step.name);
            });
            that.checkSections();
        }

        function create() {
            return $http.post(api.activities(), this);
        }

        function load(id) {
            var that = this;
            if (!id) { id = that.id; }
            return $http.get(api.activity(id))
                .then(function (response) {
                    that.setData(response.data);
                    return that;
                });
        }

        function update() {
            this.calendars = this.calendars;
            var that = this;
            return $http.put(api.activity(this.id), this).then(success, error);

            function success(response) {
                that.setData(response.data);
                that.setAllSections();
                return response;
            }
            function error(response) {
                return $q.reject(response.data);
            }
        }

        function update_location() {
            var that = this;
            var location = angular.copy(this.location);
            location.city = location.city.id;

            return $http.put(api.locations(this.id), location).then(success, error);

            function success(response) {
                angular.extend(that.location,response.data);
                that.setAllSections();
                return response;
            }
            function error(response) {
                return $q.reject(response.data);
            }
        }

        function setStockCover(cover) {
            return $http.post(api.galleryCover(this.id), {'cover_id': cover.id});
        }

        function addPicture(picture,extra_data) {
            return UploadFile.upload_activity_photo(picture, api.gallery(this.id),extra_data);
        }

        function addPictureFromStock() {
            var from_stock = true;
            return $http.post(api.gallery(this.id,from_stock), {'subcategory' : this.sub_category});
        }

        function deletePicture(picture) {
            return $http.delete(api.galleryPicture(this.id, picture.id));
        }

        function publish() {
            var that = this;

            return $http.put(api.publish(this.id)).then(success);

            function success(){
                that.published = true;
            }
        }

        function unpublish(){
            var that = this;

            return $http.put(api.unpublish(this.id)).then(success);

            function success(){
                that.published = false;
            }
        }

        function hasAssistants(){
            if (!this.calendars){ return false; }

            return this.calendars.some(function (calendar) {
                return calendar.assistants.length > 0
            });
        }

        function isFirstEdit(){
            return (!this.pictures.length && !this.published);
        }

        function checkSections() {
            var that = this;

            that.all_steps_completed = true;
            angular.forEach(_.keys(that.required_steps), function (value) {
                if (!that.isSectionCompleted(value)){ that.all_steps_completed = false; }
            });
        }

        function areAllStepsCompleted() {
            var that = this;

            that.checkSections();
            return that.all_steps_completed;
        }

        function setSectionCompleted(section, value) {
            var that = this;

            if(section in that.completed_steps){
                that.completed_steps[section] = value;
            }
        }

        function isSectionCompleted(section) {
            var that = this;
            return that.completed_steps[section];
        }

        function setStepsLeft(section){
            var that = this;

            if (!that.required_steps[section]) { return; }
            that.steps_left = 0;
            _.each(_.keys(that.required_steps),function(value){
                that.steps_left += !that.completed_steps[value] ? 1:0;
            });

        }

        function setAllSections(){
            var that = this;
            that.resetSections();
            that.updateAllSections();
            that.checkSections();
        }

        function updateAllSections(){
            var that = this;
            angular.forEach(ActivitySteps, function (step) {
                that.updateSection(step.name);
            });
        }

        function updateSection(section) {
            var that = this;
            // that.calendars = this.calendars;

            var isCompleted = false;

            if (!that.steps)
                return;

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
                    var hasCalendars = !!that.calendars && (that.calendars.length > 0);
                    isCompleted = hasCalendars;
                    break;
                case 'instructors':
                    var hasInstructors = !!that[subSections] && (that[subSections].length > 0);
                    isCompleted = hasInstructors;
                    break;
                case 'gallery':
                    var pictures = _.clone(that.pictures);
                    var main_photo = _.first(_.remove(pictures, 'main_photo', true));
                    isCompleted = !!main_photo;
                    break;
                case 'return_policy':
                    var hasReturnPolicy = !!that[subSections];
                    isCompleted = hasReturnPolicy;
                    break;
            }

            that.setSectionCompleted(section, isCompleted);
            that.setStepsLeft(section);
        }

        function resetSections() {
            var that = this;
            that.completed_steps = {};

            _.forEach(that.steps,function(value,key){
                that.completed_steps[key] = false;
            });

            that.all_steps_completed = false;
        }

        function getInstructors(){
            var that = this;
            return $http.get(api.instructors(that.id)).then(success, error);

            function success(response){
                return response.data;
            }
            function error(response){
                console.log('activity.get instructors error:', response.data);
                return response.data;
            }
        }

        function createInstructor(instructor){
            var that = this;
            return $http.post(api.instructors(that.id), instructor).then(success, error);

            function success(response){
                console.log('activity.create instructor success:', response.data);
                // that.load();
                return response.data;
            }
            function error(response){
                console.log('activity.create instructor error:', response);
                return response.data;
            }
        }

        function updateInstructor(instructor){
            var that = this;
            return $http.put(api.instructor(that.id, instructor.id), instructor).then(success, error);

            function success(response){
                console.log('activity.update instructor success:', response.data);
                // that.setData(response.data);
                // that.load();

                return response.data;
            }
            function error(response){
                console.log('activity.update instructor error:', response);
                return response.data;
            }
        }

        function deleteInstructor(instructor){
            var that = this;
            return $http.delete(api.instructor(that.id, instructor.id)).then(success, error);

            function success(response){
                console.log('activity.delete instructor success:', response.data);
                return response.data;
            }
            function error(response){
                console.log('activity.delete instructor error:', response);
                return response.data;
            }
        }
    }
})();
