(function () {
    'use strict';

    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailCalendarController', ActivityDetailCalendarController);

    ActivityDetailCalendarController.$inject = ['uiGmapGoogleMapApi', 'activity', 'calendars'];

    function ActivityDetailCalendarController(uiGmapGoogleMapApi, activity, calendars) {
        var vm = this;

        vm.calendars = calendars;
        vm.calendar_selected = calendars[0];

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

})();