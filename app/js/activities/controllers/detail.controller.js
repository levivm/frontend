/**
 * @ngdoc controller
 * @name trulii.activities.controllers.ActivityDetailController
 * @description Controller for Activity Detail Component. Handles
 * display of activity info, available calendars and assistants.
 * @requires ui.router.state.$state
 * @requires ng.$window
 * @requires uiGmapgoogle-maps.providers.uiGmapGoogleMapApi
 * @requires trulii.ui-components.services.Toast
 * @requires cities
 * @requires activity
 * @requires calendars
 */

(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailController', ActivityDetailController);

    ActivityDetailController.$inject = ['$state', '$window', 'uiGmapGoogleMapApi', 'Toast',
        'cities', 'activity', 'calendars', 'defaultPicture', 'defaultCover'];

    function ActivityDetailController($state, $window, uiGmapGoogleMapApi, Toast,
                                      cities, activity, calendars, defaultPicture, defaultCover) {
        var vm = this;

        if(activity.location && activity.location.city){
            vm.city = _.result(_.findWhere(cities, {id: activity.location.city}), 'name');
        } else {
            vm.city = null;
        }
        vm.calendars = calendars;
        vm.calendar = calendars[0];
        vm.activity = activity;
        vm.organizer = activity.organizer;
        vm.calendar_selected = vm.calendar;

        vm.getActivityVideoUrl = getActivityVideoUrl;
        vm.changeState = changeState;
        vm.changeCalendarSelected = changeCalendarSelected;
        vm.getOrganizerPhoto = getOrganizerPhoto;
        vm.getCoverStyle = getCoverStyle;
        vm.getMapStyle = getMapStyle;
        vm.getStarStyle = getStarStyle;
        vm.isSelectedCalendarFull = isSelectedCalendarFull;

        initialize();

        function isSelectedCalendarFull(){
            return vm.calendar_selected.assistants.length >= vm.calendar_selected.capacity;
        }

        function getActivityVideoUrl(){
            if(!!vm.activity.youtube_video_url){
                return vm.activity.youtube_video_url;
            } else {
                return 'https://www.youtube.com/watch?v=Gk0qepLU48o';
            }
        }

        function changeState(state) {
            $state.go('activities-detail.' + state);
        }

        function changeCalendarSelected(calendar) {
            vm.calendar_selected = calendar;
        }

        function getOrganizerPhoto(){
            if(!!vm.organizer.photo){
                return vm.organizer.photo;
            } else {
                return defaultPicture;
            }
        }

        function getCoverStyle(){
            //return {
            //    'background': "linear-gradient(rgba(255, 0, 0, 0.45),rgba(255, 0, 0, 0.45))," +
            //    "url('" + vm.activity.main_photo + "');"
            //};
            return { 'background-image': 'url('+vm.activity.photos[0].photo+')',
            'background-repeat': 'no-repeat'};
        }

        function getMapStyle(){
            return {
                'width': $window.innerWidth + 'px',
                'height': '240px'
            };
        }

        function getStarStyle(star){
            if(star <= 4){
                return {
                    'color': 'yellow'
                };
            } else {
                return {
                    'color': 'white'
                }
            }
        }

        function setUpMaps(){
            uiGmapGoogleMapApi.then(function(maps) {
                var position = new maps.LatLng(activity.location.point[0], activity.location.point[1]);
                var gmapOptions = {
                    zoom: 16,
                    center: position
                };

                var gmap = new maps.Map(document.getElementById('map-canvas'), gmapOptions);

                var marker = new maps.Marker({
                    position: position,
                    map: gmap
                });

            });
        }

        function mapMainPicture(activity){
            if(activity.photos.length > 0){
                angular.forEach(activity.photos, function(photo, index, array){
                    if(photo.main_photo){
                        activity.main_photo = photo.photo;
                    }

                    if( index === (array.length - 1) && !activity.main_photo){
                        activity.main_photo = array[0].photo;
                    }
                });
            } else {
                activity.main_photo = defaultCover;
            }
            return activity;
        }

        function setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                ACTIVITY_DISABLED : "Esta actividad se encuentra inactiva",
                ACTIVITY_SOLD_OUT: "No quedan cupos disponibles para esta actividad"
            });
        }

        function initialize(){

            setStrings();
            setUpMaps();
            vm.activity = mapMainPicture(vm.activity);
            vm.activity.rating = [1, 2, 3, 4, 5];

            if(!(vm.activity.published)){
                Toast.setPosition("toast-top-center");
                Toast.error(vm.strings.ACTIVITY_DISABLED);
            }

        }
    }
})();