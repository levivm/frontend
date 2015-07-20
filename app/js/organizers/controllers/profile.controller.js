(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileController', OrganizerProfileController);

    OrganizerProfileController.$inject = ['LocationManager', 'organizer', 'activities'];

    function OrganizerProfileController(LocationManager, organizer, activities) {

        var vm = this;

        vm.organizer = organizer;
        vm.city = null;
        vm.options = {
            actions: ['view']
        };
        vm.paginationOpts = {
            'totalItems': activities.length,
            'itemsPerPage': 3
        };
        console.log('total-items:', vm.paginationOpts.totalItems);
        console.log('items-per-page:', vm.paginationOpts.itemsPerPage);

        vm.pageNumber = 1;
        vm.activities = activities.slice(0, vm.paginationOpts.itemsPerPage);
        vm.activityPageChange = activityPageChange;

        activate();

        function activityPageChange(){
            var offset = vm.paginationOpts['itemsPerPage'];
            var start = (vm.pageNumber - 1) * offset;
            var end = start + offset;
            vm.activities = activities.slice(start, end);
        }

        function getCity(cities, organizer){
            console.log('cities:', cities);
            if(organizer.locations.length > 0){
                var cityId = organizer.locations[0].city;
                cities.find(isSameCity);
            } else {
                return null;
            }

            function isSameCity(city){
                return city.id === cityId;
            }
        }

        function setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                LABEL_PUBLISHED_ACTIVITIES: "Actividades Publicadas",
                LABEL_BIO: "Biografía",
                LABEL_CONTACT: "Contactar",
                COPY_MEMBER_SINCE: "Miembro desde "
            });
        }

        function activate(){
            setStrings();
            LocationManager.getAvailableCities().then(successCities);

            function successCities(cities){
                vm.city = getCity(cities, organizer);
                console.log('vm.city:', vm.city);
            }
        }
    }
})();