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
        'cities', 'activity', 'calendars'];

    function ActivityDetailController($state, $window, uiGmapGoogleMapApi, Toast, cities, activity, calendars) {
        var vm = this;

        vm.city = _.result(_.findWhere(cities, {id: activity.location.city}), 'name');
        vm.calendars = calendars;
        vm.calendar = calendars[0];
        vm.activity = activity;
        vm.organizer = activity.organizer;
        vm.calendar_selected = vm.calendar;

        vm.getActivityVideoUrl = getActivityVideoUrl;
        vm.changeState = changeState;
        vm.changeCalendarSelected = changeCalendarSelected;
        vm.getOrganizerPhoto = getOrganizerPhoto;
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
                return "css/img/avatar-test.jpg";
            }
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
            vm.activity.rating = [1, 2, 3, 4, 5];

            if(!(vm.activity.published)){
                Toast.setPosition("toast-top-center");
                Toast.error(vm.strings.ACTIVITY_DISABLED);
            }

        }
    }
})();