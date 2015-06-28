(function () {
    'use strict';

    angular
        .module('trulii.organizers.controllers')
        .controller('OrganizerProfileController', OrganizerProfileController);

    OrganizerProfileController.$inject = ['LocationManager', 'organizer', 'activities'];

    function OrganizerProfileController(LocationManager, organizer, activities) {

        var vm = this;

        vm.organizer = organizer;
        vm.activities = activities;
        vm.city = null;
        vm.options = {
            actions: ['view']
        };

        console.log('organizer:', organizer);

        activate();

        function setStrings(){
            if(!vm.strings){ vm.strings = {}; }
            angular.extend(vm.strings, {
                LABEL_PUBLISHED_ACTIVITIES: "Actividades Publicadas",
                LABEL_BIO: "Biografía",
                LABEL_CONTACT: "Contactar",
                COPY_MEMBER_SINCE: "Miembro desde "
            });
        }

        function getCity(cities, organizer){
            console.log('cities:', cities);
            if(organizer.locations.length > 0){
                var cityId = organizer.locations[0].city;
                cities.find(isSameCity);
            } else {
                // TODO for layout purposes
                return {
                    address: "Bogotá",
                    city: 1,
                    id: 1
                };
                return null;
            }

            function isSameCity(city){
                return city.id === cityId;
            }
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