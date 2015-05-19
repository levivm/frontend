(function () {
    'use strict';


    angular
        .module('trulii.activities.controllers')
        .controller('ActivityDetailInfoController', ActivityDetailInfoController);

    ActivityDetailInfoController.$inject = ['activity'];

    function ActivityDetailInfoController(activity) {
        var vm = this;

        vm.activity = activity;
        vm.getActivityVideoUrl = getActivityVideoUrl;

        initialize();

        function getActivityVideoUrl(){
            if(!!vm.activity.youtube_video_url){
                return vm.activity.youtube_video_url;
            } else {
                return 'https://www.youtube.com/watch?v=Gk0qepLU48o';
            }

        }

        function initialize(){
        }
    }

})();