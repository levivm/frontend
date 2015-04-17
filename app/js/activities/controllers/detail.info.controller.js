(function () {
    'use strict';


    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailInfoController', ActivityDetailInfoController);

    ActivityDetailInfoController.$inject = ['uiGmapGoogleMapApi', 'activity'];

    function ActivityDetailInfoController(uiGmapGoogleMapApi, activity) {
        var vm = this;

        vm.activity = activity;

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