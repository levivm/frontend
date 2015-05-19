(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailController', ActivityDetailController);

    ActivityDetailController.$inject = ['$state', '$window', 'uiGmapGoogleMapApi', 'Toast', 'cities', 'activity', 'calendars'];

    function ActivityDetailController($state, $window, uiGmapGoogleMapApi, Toast,cities, activity, calendars) {
        var pc = this;

        pc.city = _.result(_.findWhere(cities, {id: activity.location.city}), 'name');
        pc.calendar = calendars[0];
        pc.activity = activity;
        pc.organizer = activity.organizer;
        pc.calendar_selected = pc.calendar;
        pc.strings = {};
        pc.strings.ACTIVITY_DISABLED = "Esta actividad se encuentra inactiva";

        pc.changeState = changeState;
        pc.changeCalendarSelected = changeCalendarSelected;
        pc.getOrganizerPhoto = getOrganizerPhoto;
        pc.getMapStyle = getMapStyle;
        pc.getStarStyle = getStarStyle;

        initialize();

        function changeState(state) {
            $state.go('activities-detail.' + state);
        }

        function changeCalendarSelected(calendar) {
            pc.calendar_selected = calendar;
        }

        function getOrganizerPhoto(){
            if(!!pc.organizer.photo){
                return pc.organizer.photo;
            } else {
                return "css/img/avatar-test.jpg";
            }
        }

        function getMapStyle(){
            //return {
            //    'width': '100%',
            //    'height': '500px'
            //};
            return {
                'width': $window.innerWidth + 'px',
                'height': '480px'
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

        function initialize(){
            pc.activity.rating = [1, 2, 3, 4, 5];

            if(!(pc.activity.published)){
                Toast.setPosition("toast-top-center");
                Toast.error(pc.strings.ACTIVITY_DISABLED);
            }

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
    }
})();